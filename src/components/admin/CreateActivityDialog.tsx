import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function CreateActivityDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
  });
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);

  const uploadFile = async (file: File, bucket: string, folder: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('File upload error:', error);
      throw new Error(`Failed to upload ${file.name}: ${error.message}`);
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to create activities");
      }

      console.log('Creating activity as user:', user.id);
      
      let thumbnailUrl = null;
      let bannerUrl = null;
      const attachmentUrls = [];

      // Upload thumbnail
      if (thumbnailFile) {
        console.log('Uploading thumbnail:', thumbnailFile.name);
        thumbnailUrl = await uploadFile(thumbnailFile, 'activity-media', 'thumbnails');
      }

      // Upload banner
      if (bannerFile) {
        console.log('Uploading banner:', bannerFile.name);
        bannerUrl = await uploadFile(bannerFile, 'activity-media', 'banners');
      }

      // Upload attachments
      for (const file of attachments) {
        console.log('Uploading attachment:', file.name);
        const url = await uploadFile(file, 'activity-media', 'attachments');
        attachmentUrls.push({ name: file.name, url });
      }

      console.log('Inserting event into database...');
      const { error } = await supabase
        .from("events")
        .insert({
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          thumbnail_url: thumbnailUrl,
          banner_url: bannerUrl,
          attachments: attachmentUrls,
          created_by: user.id,
          status: "active",
        });

      if (error) {
        console.error('Database insert error:', error);
        throw new Error(`Failed to create activity: ${error.message}`);
      }

      toast({
        title: "Success",
        description: "Activity created successfully",
      });
      
      setOpen(false);
      setFormData({ title: "", description: "", location: "" });
      setStartDate(undefined);
      setEndDate(undefined);
      setThumbnailFile(null);
      setBannerFile(null);
      setAttachments([]);
      
      window.location.reload();
    } catch (error: any) {
      console.error('Activity creation error:', error);
      toast({
        title: "Error Creating Activity",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80">
          <Plus className="w-4 h-4" />
          Create New Activity
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Activity</DialogTitle>
          <DialogDescription>
            Add a new activity with details, dates, and media files
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Activity Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Independence Day Celebration"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the activity objectives and requirements"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., All Schools, School Campus"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                />
                {thumbnailFile && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setThumbnailFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner">Banner Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="banner"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
                {bannerFile && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setBannerFile(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachments">Attachments (Guidelines, Forms, etc.)</Label>
              <Input
                id="attachments"
                type="file"
                multiple
                onChange={(e) => setAttachments(Array.from(e.target.files || []))}
              />
              {attachments.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {attachments.length} file(s) selected
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-primary/80">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Create Activity
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}