import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, MapPin, Upload, FileText, ArrowLeft, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Activity {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
  program_type_id: string;
  program_types?: {
    name: string;
    code: string;
  };
}

const SchoolActivityDetail = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    fetchActivityDetail();
  }, [activityId]);

  const fetchActivityDetail = async () => {
    try {
      const { data: activityData, error: activityError } = await supabase
        .from("events")
        .select(`
          *,
          program_types (
            name,
            code
          )
        `)
        .eq("id", activityId)
        .single();

      if (activityError) throw activityError;
      setActivity(activityData);

      // Check if school has already submitted
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: schoolData } = await supabase
          .from("schools")
          .select("id")
          .eq("user_id", user.id)
          .single();

        if (schoolData) {
          const { data: submissionData } = await supabase
            .from("event_submissions")
            .select("id")
            .eq("event_id", activityId)
            .eq("school_id", schoolData.id)
            .maybeSingle();

          setHasSubmitted(!!submissionData);
        }
      }
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

  if (loading) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SchoolLayout>
    );
  }

  if (!activity) {
    return (
      <SchoolLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Activity Not Found</h2>
          <p className="text-muted-foreground mb-4">The activity you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/school/activities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>
      </SchoolLayout>
    );
  }

  const isUpcoming = new Date(activity.start_date) > new Date();
  const isOngoing = new Date(activity.start_date) <= new Date() && new Date(activity.end_date) >= new Date();
  const isPast = new Date(activity.end_date) < new Date();

  return (
    <SchoolLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/school/activities")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
          {activity.status === "active" && !isPast && (
            <Button 
              onClick={() => navigate(`/school/submit/${activityId}`)}
              disabled={hasSubmitted}
              className="bg-gradient-hero"
            >
              <Upload className="w-4 h-4 mr-2" />
              {hasSubmitted ? "Already Submitted" : "Submit Report"}
            </Button>
          )}
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={isOngoing ? "default" : isUpcoming ? "secondary" : "outline"}>
                    {isOngoing ? "Ongoing" : isUpcoming ? "Upcoming" : "Completed"}
                  </Badge>
                  {activity.program_types && (
                    <Badge variant="outline">{activity.program_types.name}</Badge>
                  )}
                  {hasSubmitted && (
                    <Badge className="bg-green-500">Submitted</Badge>
                  )}
                </div>
                <CardTitle className="text-3xl">{activity.title}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{activity.description}</p>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Event Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Start Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activity.start_date), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">End Date</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(activity.end_date), "PPP")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.location || "Not specified"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <Clock className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {Math.ceil((new Date(activity.end_date).getTime() - new Date(activity.start_date).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Submission Guidelines
                </h3>
                
                <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
                  <CardContent className="p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">1</span>
                      </div>
                      <p>Provide a detailed description of your activity (minimum 100 characters)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">2</span>
                      </div>
                      <p>Upload photos showing student participation (at least 3 photos required)</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">3</span>
                      </div>
                      <p>Optional: Include supporting documents or certificates</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">4</span>
                      </div>
                      <p>Optional: Add publication details if featured in media</p>
                    </div>
                  </CardContent>
                </Card>

                {!hasSubmitted && activity.status === "active" && !isPast && (
                  <Button 
                    onClick={() => navigate(`/school/submit/${activityId}`)}
                    className="w-full bg-gradient-hero"
                    size="lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Your Report
                  </Button>
                )}

                {hasSubmitted && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm text-green-700 dark:text-green-300 font-medium">
                      ✓ You have already submitted a report for this activity
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
};

export default SchoolActivityDetail;
