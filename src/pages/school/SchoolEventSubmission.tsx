import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Upload, X, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SchoolLayout } from "./SchoolLayout";
import { z } from "zod";

const SchoolEventSubmission = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  
  // Section A: School & Contact Details
  const [kcNo, setKcNo] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [kendraName, setKendraName] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [schoolContact, setSchoolContact] = useState("");
  const [schoolEmail, setSchoolEmail] = useState("");
  
  // Section B: Teacher In-Charge
  const [teacherName, setTeacherName] = useState("");
  const [teacherMobile, setTeacherMobile] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  
  // Section C: Program Details
  const [state, setState] = useState("");
  const [programType, setProgramType] = useState("");
  const [description, setDescription] = useState("");
  const [document, setDocument] = useState<File | null>(null);
  
  // Section D: Media Uploads
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  
  // Section E: Print Media
  const [printDate, setPrintDate] = useState("");
  const [printUrl, setPrintUrl] = useState("");
  const [printScan, setPrintScan] = useState<File | null>(null);
  
  // Section F: TV Channel
  const [tvChannel, setTvChannel] = useState("");
  const [tvTelecastDate, setTvTelecastDate] = useState("");
  const [tvUrl, setTvUrl] = useState("");
  const [tvVideo, setTvVideo] = useState<File | null>(null);

  const wordCount = description.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!kcNo || !schoolName || !principalName || !schoolContact || !schoolEmail) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all required school details.",
        variant: "destructive",
      });
      return;
    }

    if (!teacherName || !teacherMobile || !teacherEmail) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill all teacher in-charge details.",
        variant: "destructive",
      });
      return;
    }

    if (!state || !programType) {
      toast({
        title: "Required Fields Missing",
        description: "Please select state and program type.",
        variant: "destructive",
      });
      return;
    }

    if (wordCount > 250) {
      toast({
        title: "Description Too Long",
        description: "Description must not exceed 250 words.",
        variant: "destructive",
      });
      return;
    }

    if (description.trim() && wordCount < 50 && !document) {
      toast({
        title: "Description Required",
        description: "Please provide at least 50 words or upload a document.",
        variant: "destructive",
      });
      return;
    }

    if (photos.length < 4) {
      toast({
        title: "Photos Required",
        description: "Please upload at least 4 photos of the program.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get current user and school
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (schoolError) throw schoolError;

      // Create submission with all details
      const submissionDescription = description || "See attached document";
      const { data: submissionData, error: submissionError } = await supabase
        .from("event_submissions")
        .insert({
          event_id: eventId,
          school_id: schoolData.id,
          short_description: submissionDescription,
          status: "pending",
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

      // Upload document if present
      if (document) {
        const fileExt = document.name.split('.').pop();
        const fileName = `${user.id}/${submissionData.id}/document-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('submission-media')
          .upload(fileName, document);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('submission-media')
          .getPublicUrl(fileName);

        await supabase.from("event_submissions").update({
          document_url: publicUrl
        }).eq('id', submissionData.id);
      }

      // Upload photos to storage
      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${user.id}/${submissionData.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('submission-media')
          .upload(fileName, photo);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('submission-media')
          .getPublicUrl(fileName);

        await supabase.from("media_files").insert({
          submission_id: submissionData.id,
          file_url: publicUrl,
          file_type: photo.type,
          file_size: photo.size,
        });
      }

      // Upload video if present
      if (video) {
        const fileExt = video.name.split('.').pop();
        const fileName = `${user.id}/${submissionData.id}/video-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('submission-media')
          .upload(fileName, video);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('submission-media')
          .getPublicUrl(fileName);

        await supabase.from("media_files").insert({
          submission_id: submissionData.id,
          file_url: publicUrl,
          file_type: video.type,
          file_size: video.size,
        });
      }

      // Upload print media scan if present
      if (printScan) {
        const fileExt = printScan.name.split('.').pop();
        const fileName = `${user.id}/${submissionData.id}/print-scan-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('submission-media')
          .upload(fileName, printScan);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('submission-media')
            .getPublicUrl(fileName);

          await supabase.from("publications").insert({
            submission_id: submissionData.id,
            media_type: "print",
            url: printUrl,
            publication_date: printDate || null,
            file_url: publicUrl,
          });
        }
      } else if (printUrl) {
        await supabase.from("publications").insert({
          submission_id: submissionData.id,
          media_type: "print",
          url: printUrl,
          publication_date: printDate || null,
        });
      }

      // Upload TV video if present
      if (tvVideo) {
        const fileExt = tvVideo.name.split('.').pop();
        const fileName = `${user.id}/${submissionData.id}/tv-video-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('submission-media')
          .upload(fileName, tvVideo);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('submission-media')
            .getPublicUrl(fileName);

          await supabase.from("publications").insert({
            submission_id: submissionData.id,
            media_type: "tv",
            media_name: tvChannel,
            url: tvUrl,
            publication_date: tvTelecastDate || null,
            file_url: publicUrl,
          });
        }
      } else if (tvChannel || tvUrl) {
        await supabase.from("publications").insert({
          submission_id: submissionData.id,
          media_type: "tv",
          media_name: tvChannel,
          url: tvUrl,
          publication_date: tvTelecastDate || null,
        });
      }

      toast({
        title: "Report Submitted Successfully!",
        description: "Your activity report has been submitted for review.",
      });
      
      navigate("/school/submissions");
    } catch (error: any) {
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SchoolLayout>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Karuna Club Event Highlights Submission Form</h1>
          <p className="text-muted-foreground">
            Please fill out all sections carefully. Fields marked with * are mandatory.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Accordion type="multiple" defaultValue={["section-a", "section-c", "section-d"]} className="space-y-4">
            {/* Section A: School & Contact Details */}
            <AccordionItem value="section-a" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section A: Basic School & Contact Details</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kcNo">KC No *</Label>
                    <Input 
                      id="kcNo" 
                      value={kcNo}
                      onChange={(e) => setKcNo(e.target.value)}
                      placeholder="Enter KC Number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input 
                      id="schoolName" 
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Enter school name"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="kendraName">Nearest Karuna Kendra Name</Label>
                    <Input 
                      id="kendraName" 
                      value={kendraName}
                      onChange={(e) => setKendraName(e.target.value)}
                      placeholder="Enter kendra name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="principalName">School Principal's Name *</Label>
                    <Input 
                      id="principalName" 
                      value={principalName}
                      onChange={(e) => setPrincipalName(e.target.value)}
                      placeholder="Enter principal name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="schoolContact">School Contact Number *</Label>
                    <Input 
                      id="schoolContact" 
                      type="tel"
                      value={schoolContact}
                      onChange={(e) => setSchoolContact(e.target.value)}
                      placeholder="Enter contact number"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="schoolEmail">School Email ID *</Label>
                    <Input 
                      id="schoolEmail" 
                      type="email"
                      value={schoolEmail}
                      onChange={(e) => setSchoolEmail(e.target.value)}
                      placeholder="school@example.com"
                      required
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section B: Teacher In-Charge */}
            <AccordionItem value="section-b" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section B: Karuna Club Teacher In-Charge</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="teacherName">Name *</Label>
                    <Input 
                      id="teacherName" 
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      placeholder="Enter teacher name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherMobile">Mobile Number *</Label>
                    <Input 
                      id="teacherMobile" 
                      type="tel"
                      value={teacherMobile}
                      onChange={(e) => setTeacherMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="teacherEmail">Email ID *</Label>
                    <Input 
                      id="teacherEmail" 
                      type="email"
                      value={teacherEmail}
                      onChange={(e) => setTeacherEmail(e.target.value)}
                      placeholder="teacher@example.com"
                      required
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section C: Program Details */}
            <AccordionItem value="section-c" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section C: Event Program Details</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">Select State *</Label>
                    <Select value={state} onValueChange={setState} required>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="programType">Select Program *</Label>
                    <Select value={programType} onValueChange={setProgramType} required>
                      <SelectTrigger id="programType">
                        <SelectValue placeholder="Select program type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="intra-school">Organising Intra School Programmes</SelectItem>
                        <SelectItem value="inter-school">Organising Inter School Programmes</SelectItem>
                        <SelectItem value="participation">Participation in Inter-School Competitions/Programmes</SelectItem>
                        <SelectItem value="pr">Public Relation Programmes</SelectItem>
                        <SelectItem value="growth">Karuna Club – Internal / External Growth</SelectItem>
                        <SelectItem value="national">Organising / Participation in National Level Programme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Short Description (Max 250 words) *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the event..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={6}
                    className="resize-none"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Word count: {wordCount} / 250</span>
                    {wordCount > 250 && <span className="text-destructive">Exceeds maximum</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document">OR Upload Description Document (Word/PDF, Max 10MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="document"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setDocument(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {document && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDocument(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {document && (
                    <p className="text-sm text-muted-foreground">
                      {document.name} ({(document.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section D: Media Uploads */}
            <AccordionItem value="section-d" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section D: Media Uploads</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="photos">Photos of Program (4-5 photos required) *</Label>
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload 4-5 photos (Max 10MB each). Current: {photos.length} photo(s)
                  </p>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border-2">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm px-2 py-1">
                          <p className="text-xs text-white truncate">{photo.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="video">Video File (Optional, Max 10MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="video"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideo(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {video && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setVideo(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {video && (
                    <p className="text-sm text-muted-foreground">
                      {video.name} ({(video.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section E: Print Media */}
            <AccordionItem value="section-e" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section E: Publication Details – Print Media (Optional)</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="printDate">Date of Publication</Label>
                    <Input 
                      id="printDate" 
                      type="date"
                      value={printDate}
                      onChange={(e) => setPrintDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="printUrl">Website URL Link</Label>
                    <Input 
                      id="printUrl" 
                      type="url"
                      value={printUrl}
                      onChange={(e) => setPrintUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="printScan">Scan Copy of Publication (PDF/Image, Max 10MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="printScan"
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setPrintScan(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {printScan && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPrintScan(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {printScan && (
                    <p className="text-sm text-muted-foreground">
                      {printScan.name} ({(printScan.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section F: TV Channel */}
            <AccordionItem value="section-f" className="border-2 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-6 py-4 hover:no-underline bg-muted/20">
                <span className="text-lg font-semibold">Section F: Publication Details – TV Channel (Optional)</span>
              </AccordionTrigger>
              <AccordionContent className="px-6 py-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tvChannel">TV Channel Name</Label>
                    <Input 
                      id="tvChannel" 
                      value={tvChannel}
                      onChange={(e) => setTvChannel(e.target.value)}
                      placeholder="Enter channel name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tvTelecastDate">Program Telecast Date</Label>
                    <Input 
                      id="tvTelecastDate" 
                      type="date"
                      value={tvTelecastDate}
                      onChange={(e) => setTvTelecastDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="tvUrl">Program URL</Label>
                    <Input 
                      id="tvUrl" 
                      type="url"
                      value={tvUrl}
                      onChange={(e) => setTvUrl(e.target.value)}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tvVideo">Program Video Upload (Max 10MB)</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="tvVideo"
                      type="file"
                      accept="video/*"
                      onChange={(e) => setTvVideo(e.target.files?.[0] || null)}
                      className="flex-1"
                    />
                    {tvVideo && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setTvVideo(null)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  {tvVideo && (
                    <p className="text-sm text-muted-foreground">
                      {tvVideo.name} ({(tvVideo.size / (1024 * 1024)).toFixed(2)} MB)
                    </p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/school/activities")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Submit Report
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </SchoolLayout>
  );
};

export default SchoolEventSubmission;
