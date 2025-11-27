import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormStepper } from "@/components/school/FormStepper";
import { FileUploadZone } from "@/components/school/FileUploadZone";
import { ArrowLeft, ArrowRight, Save, Send, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const PROGRAM_TYPES = [
  { value: "A", label: "A - Organising Intra School Programmes" },
  { value: "B", label: "B - Organising Inter School Programmes" },
  { value: "C", label: "C - Participation in Inter-School Competitions" },
  { value: "D", label: "D - Public Relation Programmes" },
  { value: "E", label: "E - Karuna Club – Internal / External Growth" },
  { value: "F", label: "F - Organising/Participation in National Level Programme" },
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const steps = [
  { id: 1, title: "School & Teacher", description: "Basic details" },
  { id: 2, title: "Event Details", description: "Program info" },
  { id: 3, title: "Media Upload", description: "Photos & videos" },
  { id: 4, title: "Publications", description: "Print & TV" },
  { id: 5, title: "Review", description: "Confirm & submit" },
];

const schoolSchema = z.object({
  kcNo: z.string().trim().min(1).max(50),
  schoolName: z.string().trim().min(2).max(200),
  principalName: z.string().trim().min(2).max(100),
  schoolContact: z.string().regex(/^[0-9]{10}$/),
  schoolEmail: z.string().email().max(255),
  kendraName: z.string().trim().min(2).max(200),
  teacherName: z.string().trim().min(2).max(100),
  teacherMobile: z.string().regex(/^[0-9]{10}$/),
  teacherEmail: z.string().email().max(255),
});

export default function SchoolSubmit() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    kcNo: "",
    schoolName: "",
    principalName: "",
    schoolContact: "",
    schoolEmail: "",
    kendraName: "",
    teacherName: "",
    teacherMobile: "",
    teacherEmail: "",
    state: "",
    programType: "",
    description: "",
    descriptionFile: null as File | null,
    printDate: "",
    printUrl: "",
    printScanFile: null as File | null,
    tvChannel: "",
    tvDate: "",
    tvUrl: "",
    tvVideoFile: null as File | null,
  });

  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File[]>([]);
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    fetchEventAndSchool();
  }, [eventId]);

  useEffect(() => {
    const words = formData.description.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }, [formData.description]);

  const fetchEventAndSchool = async () => {
    try {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single();
      
      setEvent(eventData);

      if (user) {
        const { data: schoolData } = await supabase
          .from("schools")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (schoolData) {
          setSchool(schoolData);
          setFormData(prev => ({
            ...prev,
            kcNo: schoolData.kc_no || "",
            schoolName: schoolData.school_name || "",
            principalName: schoolData.principal_name || "",
            schoolContact: schoolData.contact_number || "",
            schoolEmail: schoolData.email || "",
            kendraName: schoolData.kendra_name || "",
          }));

          const { data: teacherData } = await supabase
            .from("teachers")
            .select("*")
            .eq("school_id", schoolData.id)
            .eq("is_current", true)
            .maybeSingle();

          if (teacherData) {
            setFormData(prev => ({
              ...prev,
              teacherName: teacherData.name || "",
              teacherMobile: teacherData.mobile || "",
              teacherEmail: teacherData.email || "",
            }));
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 0) {
      try {
        schoolSchema.parse(formData);
        return true;
      } catch (error: any) {
        toast({
          title: "Validation Error",
          description: error.errors?.[0]?.message || "Please fill all required fields correctly",
          variant: "destructive",
        });
        return false;
      }
    }
    if (step === 1) {
      if (!formData.state || !formData.programType) {
        toast({
          title: "Required Fields",
          description: "Please select state and program type",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.description && !formData.descriptionFile) {
        toast({
          title: "Required Field",
          description: "Please enter description or upload document",
          variant: "destructive",
        });
        return false;
      }
      if (formData.description && wordCount > 250) {
        toast({
          title: "Description Too Long",
          description: `Please limit description to 250 words (current: ${wordCount})`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (photos.length < 4 || photos.length > 5) {
        toast({
          title: "Photo Requirement",
          description: "Please upload 4-5 photos",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep - 1)) return;
    
    setLoading(true);
    try {
      // Upload files and create submission
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const filePath = `submissions/${Date.now()}_${photo.name}`;
        const { error: uploadError } = await supabase.storage
          .from("activity-media")
          .upload(filePath, photo);
        
        if (!uploadError) {
          const { data } = supabase.storage.from("activity-media").getPublicUrl(filePath);
          photoUrls.push(data.publicUrl);
        }
      }

      let videoUrl = null;
      if (video.length > 0) {
        const filePath = `submissions/${Date.now()}_${video[0].name}`;
        const { error: uploadError } = await supabase.storage
          .from("activity-media")
          .upload(filePath, video[0]);
        
        if (!uploadError) {
          const { data } = supabase.storage.from("activity-media").getPublicUrl(filePath);
          videoUrl = data.publicUrl;
        }
      }

      // Create submission
      const { data: submission, error: subError } = await supabase
        .from("event_submissions")
        .insert({
          school_id: school.id,
          event_id: eventId,
          short_description: formData.description,
          status: "pending",
        })
        .select()
        .single();

      if (subError) throw subError;

      toast({
        title: "Success",
        description: "Your submission has been received!",
      });
      navigate("/school/submissions");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">School Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kcNo">KC No *</Label>
                  <Input
                    id="kcNo"
                    value={formData.kcNo}
                    onChange={(e) => setFormData({ ...formData, kcNo: e.target.value })}
                    placeholder="Enter KC Number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    placeholder="Enter school name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principalName">Principal Name *</Label>
                  <Input
                    id="principalName"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    placeholder="Enter principal's name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolContact">School Contact *</Label>
                  <Input
                    id="schoolContact"
                    value={formData.schoolContact}
                    onChange={(e) => setFormData({ ...formData, schoolContact: e.target.value })}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">School Email *</Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    value={formData.schoolEmail}
                    onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                    placeholder="school@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kendraName">Nearest Karuna Kendra *</Label>
                  <Input
                    id="kendraName"
                    value={formData.kendraName}
                    onChange={(e) => setFormData({ ...formData, kendraName: e.target.value })}
                    placeholder="Enter kendra name"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Teacher In-Charge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">Teacher Name *</Label>
                  <Input
                    id="teacherName"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    placeholder="Enter teacher's name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherMobile">Teacher Mobile *</Label>
                  <Input
                    id="teacherMobile"
                    value={formData.teacherMobile}
                    onChange={(e) => setFormData({ ...formData, teacherMobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">Teacher Email *</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    value={formData.teacherEmail}
                    onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                    placeholder="teacher@example.com"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">Select State *</Label>
                <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="programType">Select Program *</Label>
                <Select value={formData.programType} onValueChange={(value) => setFormData({ ...formData, programType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose program type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROGRAM_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">Short Description *</Label>
                <span className={`text-xs ${wordCount > 250 ? 'text-destructive' : 'text-muted-foreground'}`}>
                  {wordCount}/250 words
                </span>
              </div>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter event description (max 250 words)"
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">OR upload a document below</p>
            </div>

            <FileUploadZone
              accept=".doc,.docx,.pdf"
              maxSize={10}
              maxFiles={1}
              files={formData.descriptionFile ? [formData.descriptionFile] : []}
              onFilesChange={(files) => setFormData({ ...formData, descriptionFile: files[0] || null })}
              label="Upload Description Document (Optional)"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <FileUploadZone
              accept="image/*"
              maxSize={10}
              maxFiles={5}
              files={photos}
              onFilesChange={setPhotos}
              label="Upload Photos (4-5 required)"
              required
            />

            <FileUploadZone
              accept="video/*"
              maxSize={10}
              maxFiles={1}
              files={video}
              onFilesChange={setVideo}
              label="Upload Video (Optional)"
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Print Media (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="printDate">Date of Publication</Label>
                  <Input
                    id="printDate"
                    type="date"
                    value={formData.printDate}
                    onChange={(e) => setFormData({ ...formData, printDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printUrl">Website URL</Label>
                  <Input
                    id="printUrl"
                    type="url"
                    value={formData.printUrl}
                    onChange={(e) => setFormData({ ...formData, printUrl: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
              </div>
              <FileUploadZone
                accept="image/*,.pdf"
                maxSize={10}
                maxFiles={1}
                files={formData.printScanFile ? [formData.printScanFile] : []}
                onFilesChange={(files) => setFormData({ ...formData, printScanFile: files[0] || null })}
                label="Upload Scan Copy"
              />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">TV Channel (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="tvChannel">Channel Name</Label>
                  <Input
                    id="tvChannel"
                    value={formData.tvChannel}
                    onChange={(e) => setFormData({ ...formData, tvChannel: e.target.value })}
                    placeholder="Enter channel name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tvDate">Telecast Date</Label>
                  <Input
                    id="tvDate"
                    type="date"
                    value={formData.tvDate}
                    onChange={(e) => setFormData({ ...formData, tvDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="tvUrl">Program URL</Label>
                  <Input
                    id="tvUrl"
                    type="url"
                    value={formData.tvUrl}
                    onChange={(e) => setFormData({ ...formData, tvUrl: e.target.value })}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              <FileUploadZone
                accept="video/*"
                maxSize={10}
                maxFiles={1}
                files={formData.tvVideoFile ? [formData.tvVideoFile] : []}
                onFilesChange={(files) => setFormData({ ...formData, tvVideoFile: files[0] || null })}
                label="Upload TV Video Clip"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-muted/50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold">Submission Summary</h3>
              
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">School Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">KC No:</span> {formData.kcNo}</div>
                  <div><span className="text-muted-foreground">School:</span> {formData.schoolName}</div>
                  <div><span className="text-muted-foreground">Principal:</span> {formData.principalName}</div>
                  <div><span className="text-muted-foreground">Email:</span> {formData.schoolEmail}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Teacher In-Charge</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">Name:</span> {formData.teacherName}</div>
                  <div><span className="text-muted-foreground">Mobile:</span> {formData.teacherMobile}</div>
                  <div><span className="text-muted-foreground">Email:</span> {formData.teacherEmail}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-2">Event Details</h4>
                <div className="text-sm space-y-1">
                  <div><span className="text-muted-foreground">State:</span> {formData.state}</div>
                  <div><span className="text-muted-foreground">Program:</span> {PROGRAM_TYPES.find(p => p.value === formData.programType)?.label}</div>
                  <div><span className="text-muted-foreground">Photos:</span> {photos.length} uploaded</div>
                  <div><span className="text-muted-foreground">Video:</span> {video.length > 0 ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 p-4 bg-muted/30 rounded-lg">
              <input type="checkbox" id="confirm" className="w-4 h-4" required />
              <Label htmlFor="confirm" className="text-sm cursor-pointer">
                I confirm that all information provided is accurate and complete
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!event) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/school/activities")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Submit Event Highlights</h1>
            <p className="text-muted-foreground">{event.title}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <FormStepper steps={steps} currentStep={currentStep} />
          </CardHeader>
          <CardContent className="pt-6">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>

              {currentStep < steps.length - 1 ? (
                <Button onClick={handleNext} className="gap-2">
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={loading} className="gap-2 bg-gradient-hero">
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Submit
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
}
