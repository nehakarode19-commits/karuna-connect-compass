import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Eye, Award, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { getDemoActivity } from "@/data/demoActivities";

interface Activity {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  thumbnail_url: string | null;
  status: string;
}

interface Submission {
  id: string;
  school_id: string;
  status: string;
  score: number | null;
  submitted_at: string;
  schools: {
    school_name: string;
    kc_no: string;
  };
}

const AdminActivityDetail = () => {
  const { activityId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const isValidUUID = (id: string) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id);
  };

  useEffect(() => {
    if (activityId) {
      fetchActivityDetails();
    }
  }, [activityId]);

  const fetchActivityDetails = async () => {
    const demoId = activityId?.startsWith("demo-") ? activityId : `demo-${activityId}`;
    const demoActivity = getDemoActivity(demoId);
    
    if (demoActivity) {
      setActivity(demoActivity);
      setSubmissions([
        {
          id: "demo-sub-1",
          school_id: "demo-school-1",
          status: "approved",
          score: 85,
          submitted_at: "2024-12-05T10:00:00Z",
          schools: { school_name: "Delhi Public School", kc_no: "KC-001" }
        },
        {
          id: "demo-sub-2",
          school_id: "demo-school-2",
          status: "pending",
          score: null,
          submitted_at: "2024-12-06T14:30:00Z",
          schools: { school_name: "St. Mary's High School", kc_no: "KC-002" }
        },
        {
          id: "demo-sub-3",
          school_id: "demo-school-3",
          status: "rejected",
          score: null,
          submitted_at: "2024-12-04T09:15:00Z",
          schools: { school_name: "Greenfield Academy", kc_no: "KC-003" }
        }
      ]);
      setLoading(false);
      return;
    }

    if (!isValidUUID(activityId!)) {
      setLoading(false);
      return;
    }

    try {
      const { data: activityData, error: activityError } = await supabase
        .from("events")
        .select("*")
        .eq("id", activityId)
        .maybeSingle();

      if (activityError) throw activityError;
      
      if (activityData) {
        setActivity(activityData);

        const { data: submissionsData, error: submissionsError } = await supabase
          .from("event_submissions")
          .select(`
            *,
            schools (
              school_name,
              kc_no
            )
          `)
          .eq("event_id", activityId)
          .order("submitted_at", { ascending: false });

        if (submissionsError) throw submissionsError;
        setSubmissions(submissionsData || []);
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
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!activity) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">Activity not found</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => navigate("/admin/activity")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </Button>
          <Button variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Activity
          </Button>
        </div>

        <Card className="shadow-medium border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-2xl font-bold">{activity.title}</h1>
              <Badge variant={activity.status === "active" ? "default" : "secondary"}>
                {activity.status}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {new Date(activity.start_date).toLocaleDateString()} - {new Date(activity.end_date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {activity.location}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
                <TabsTrigger value="approved">
                  Approved ({submissions.filter(s => s.status === "approved").length})
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending ({submissions.filter(s => s.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({submissions.filter(s => s.status === "rejected").length})
                </TabsTrigger>
              </TabsList>

              {["all", "approved", "pending", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-3 mt-6">
                  {submissions
                    .filter((s) => tab === "all" || s.status === tab)
                    .map((submission) => (
                      <div
                        key={submission.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-medium">{submission.schools.school_name}</p>
                            <Badge variant="outline" className="text-xs font-mono">
                              {submission.schools.kc_no}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Submitted: {new Date(submission.submitted_at).toLocaleDateString()}</span>
                            {submission.score && (
                              <span className="flex items-center gap-1">
                                <Award className="w-4 h-4" />
                                Score: {submission.score}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              submission.status === "approved"
                                ? "default"
                                : submission.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {submission.status}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  {submissions.filter((s) => tab === "all" || s.status === tab).length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No {tab === "all" ? "" : tab} submissions found
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityDetail;
