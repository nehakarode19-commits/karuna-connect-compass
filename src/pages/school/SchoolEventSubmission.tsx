import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Upload, Image, Video, FileText, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SchoolEventSubmission = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();
  
  const [programType, setProgramType] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [document, setDocument] = useState<File | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newPhotos = Array.from(e.target.files);
      setPhotos([...photos, ...newPhotos]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Report Submitted Successfully!",
      description: "Your activity report has been submitted for review.",
    });
    
    navigate("/school/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate("/school/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
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
                />
                <p className="text-xs text-muted-foreground">Minimum 100 characters</p>
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
                  <Input id="mediaName" placeholder="e.g., Times of India" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationDate">Publication Date</Label>
                  <Input id="publicationDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteUrl">Website URL</Label>
                  <Input id="websiteUrl" type="url" placeholder="https://" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publicationScan">Publication Scan</Label>
                  <Input id="publicationScan" type="file" accept="image/*,.pdf" />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/school/dashboard")}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-2 bg-gradient-hero border-0">
              <Upload className="w-4 h-4" />
              Submit Report
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SchoolEventSubmission;
