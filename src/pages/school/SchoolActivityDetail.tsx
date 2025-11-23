import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, FileText, Image as ImageIcon, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Activity {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  thumbnail_url: string | null;
  banner_url: string | null;
  attachments: any;
  status: string;
}

const SchoolActivityDetail = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActivity();
  }, [activityId]);

  const fetchActivity = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", activityId)
        .single();

      if (error) throw error;
      setActivity(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load activity details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </SchoolLayout>
    );
  }

  if (!activity) {
    return (
      <SchoolLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Activity Not Found</h2>
          <Button className="mt-4" onClick={() => navigate("/school/activities")}>
            Back to Activities
          </Button>
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/school/activities")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{activity.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(activity.start_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{activity.location}</span>
              </div>
              <Badge>{activity.status}</Badge>
            </div>
          </div>
          <Button 
            onClick={() => navigate(`/school/activity/${activityId}/submit`)}
            className="bg-gradient-hero"
          >
            Submit Report
          </Button>
        </div>

        {activity.banner_url && (
          <div className="aspect-[21/9] w-full rounded-lg overflow-hidden">
            <img 
              src={activity.banner_url} 
              alt={activity.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="media">Media & Resources</TabsTrigger>
            <TabsTrigger value="guidelines">Submission Guidelines</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                  {activity.description}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">{new Date(activity.start_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">{new Date(activity.end_date).toLocaleDateString('en-IN', { dateStyle: 'long' })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{activity.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge>{activity.status}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="media" className="space-y-6">
            {activity.thumbnail_url && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Activity Thumbnail
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={activity.thumbnail_url} 
                    alt={activity.title}
                    className="w-full rounded-lg"
                  />
                </CardContent>
              </Card>
            )}

            {activity.attachments && Array.isArray(activity.attachments) && activity.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Attachments & Resources
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {activity.attachments.map((attachment: any, index: number) => (
                      <a
                        key={index}
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="w-5 h-5 text-primary" />
                        <span className="flex-1">{attachment.name}</span>
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="guidelines" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Submission Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Detailed Description</h4>
                      <p className="text-sm text-muted-foreground">
                        Provide at least 100 characters describing what was done, who participated, and the impact of the activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Photo Documentation</h4>
                      <p className="text-sm text-muted-foreground">
                        Upload at least 3 high-quality photos showing the activity in progress. Each photo should be maximum 5MB.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Video Evidence (Optional)</h4>
                      <p className="text-sm text-muted-foreground">
                        You may upload a video file (max 100MB) showing highlights of the activity.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">Publication Details (Optional)</h4>
                      <p className="text-sm text-muted-foreground">
                        If the activity was covered by media, provide publication details including media name, date, and URL/scanned copy.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> All submissions will be reviewed by evaluators. Make sure to provide complete and accurate information for faster approval.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SchoolLayout>
  );
};

export default SchoolActivityDetail;