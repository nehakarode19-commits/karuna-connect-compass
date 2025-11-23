import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Image, Video, FileText, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SchoolLayout } from "./SchoolLayout";

const SchoolEventSubmission = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [programType, setProgramType] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [mediaName, setMediaName] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

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
    
    if (description.length < 100) {
      toast({
        title: "Description Too Short",
        description: "Please provide at least 100 characters in the description.",
        variant: "destructive",
      });
      return;
    }

    if (photos.length < 3) {
      toast({
        title: "Photos Required",
        description: "Please upload at least 3 photos of the activity.",
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

      // Create submission
      const { data: submissionData, error: submissionError } = await supabase
        .from("event_submissions")
        .insert({
          event_id: eventId,
          school_id: schoolData.id,
          short_description: description,
          status: "pending",
        })
        .select()
        .single();

      if (submissionError) throw submissionError;

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

      // Add publication details if provided
      if (mediaName || websiteUrl) {
        await supabase.from("publications").insert({
          submission_id: submissionData.id,
          media_type: "print",
          media_name: mediaName,
          url: websiteUrl,
          publication_date: publicationDate || null,
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Activity Report</h1>
          <p className="text-muted-foreground">
            Fill out the form below to submit your Karuna Club activity report
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="border-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="programType">Program Type *</Label>
                <Select value={programType} onValueChange={setProgramType} required>
                  <SelectTrigger id="programType">
                    <SelectValue placeholder="Select program type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intra-school">Intra School</SelectItem>
                    <SelectItem value="inter-school">Inter School</SelectItem>
                    <SelectItem value="pr">PR Activities</SelectItem>
                    <SelectItem value="growth">Growth Activities</SelectItem>
                    <SelectItem value="national">National Level</SelectItem>
                    <SelectItem value="environment">Environmental</SelectItem>
                    <SelectItem value="social">Social Service</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Activity Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide a detailed description of the activity, including what was done, who participated, and the impact..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                  minLength={100}
                />
                <p className="text-xs text-muted-foreground">
                  {description.length}/100 characters (minimum required)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Upload Description Document (Optional)</Label>
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
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span>{document.name}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Media Upload</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="photos">Photos of the Program *</Label>
                <Input
                  id="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                />
                <p className="text-xs text-muted-foreground">Upload up to 10 photos (Max 5MB each)</p>
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
                      <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm rounded px-2 py-1">
                        <p className="text-xs text-white truncate">{photo.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="video">Video File (Optional)</Label>
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
                <p className="text-xs text-muted-foreground">Max file size: 100MB</p>
                {video && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground p-3 rounded-lg bg-muted">
                    <Video className="w-4 h-4" />
                    <span>{video.name}</span>
                    <span className="ml-auto">{(video.size / (1024 * 1024)).toFixed(2)} MB</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Publication Details (Optional)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="mediaName">Media Name</Label>
                  <Input 
                    id="mediaName" 
                    placeholder="e.g., Times of India"
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input 
                    id="publicationDate" 
                    type="date"
                    value={publicationDate}
                    onChange={(e) => setPublicationDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input 
                    id="websiteUrl" 
                    type="url" 
                    placeholder="https://"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/school/activity/${eventId}`)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-gradient-hero border-0" disabled={loading}>
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
