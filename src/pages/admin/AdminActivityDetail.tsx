import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Users, FileText, TrendingUp, Eye, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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

  useEffect(() => {
    if (activityId) {
      fetchActivityDetails();
    }
  }, [activityId]);

  const fetchActivityDetails = async () => {
    try {
      const { data: activityData, error: activityError } = await supabase
        .from("events")
        .select("*")
        .eq("id", activityId)
        .single();

      if (activityError) throw activityError;
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
          <p className="text-muted-foreground">Loading activity details...</p>
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

  const stats = [
    {
      label: "Total Submissions",
      value: submissions.length,
      icon: FileText,
      color: "text-blue-600 bg-blue-500/10"
    },
    {
      label: "Approved",
      value: submissions.filter(s => s.status === "approved").length,
      icon: Award,
      color: "text-green-600 bg-green-500/10"
    },
    {
      label: "Pending Review",
      value: submissions.filter(s => s.status === "pending").length,
      icon: TrendingUp,
      color: "text-orange-600 bg-orange-500/10"
    },
    {
      label: "Participating Schools",
      value: new Set(submissions.map(s => s.school_id)).size,
      icon: Users,
      color: "text-purple-600 bg-purple-500/10"
    }
  ];

  const avgScore = submissions.filter(s => s.score).length > 0
    ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.filter(s => s.score).length).toFixed(1)
    : "N/A";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate("/admin/activity")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Activities
          </Button>
        </div>

        <Card className="shadow-medium border-border/50">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {activity.thumbnail_url && (
                <img
                  src={activity.thumbnail_url}
                  alt={activity.title}
                  className="w-full md:w-64 h-48 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{activity.title}</h1>
                    <p className="text-muted-foreground">{activity.description}</p>
                  </div>
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
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-medium border-border/50">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[0]}`} />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle>Submissions Overview</CardTitle>
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
