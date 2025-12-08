import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, FileText, Eye, Award, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { demoSubmissions } from "@/data/demoData";

interface Submission {
  id: string;
  event_id: string;
  status: string;
  score: number | null;
  submitted_at: string;
  admin_comments: string | null;
  events: {
    title: string;
  };
}

const SchoolSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, [user]);

  const fetchSubmissions = async () => {
    try {
      if (!user) {
        // Use demo data when not logged in
        const demoSchoolSubmissions = demoSubmissions.map(s => ({
          id: s.id,
          event_id: s.event_id,
          status: s.status,
          score: s.score,
          submitted_at: s.submitted_at || "",
          admin_comments: s.admin_comments,
          events: s.events
        }));
        setSubmissions(demoSchoolSubmissions);
        setLoading(false);
        return;
      }
      
      // First get the school for this user
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("id")
        .eq("user_id", user?.id)
        .maybeSingle();

      if (schoolError) throw schoolError;
      if (!schoolData) {
        // Use demo data if no school found
        const demoSchoolSubmissions = demoSubmissions.map(s => ({
          id: s.id,
          event_id: s.event_id,
          status: s.status,
          score: s.score,
          submitted_at: s.submitted_at || "",
          admin_comments: s.admin_comments,
          events: s.events
        }));
        setSubmissions(demoSchoolSubmissions);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("event_submissions")
        .select(`
          *,
          events (
            title
          )
        `)
        .eq("school_id", schoolData.id)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSubmissions(data);
      } else {
        // Use demo data if no submissions
        const demoSchoolSubmissions = demoSubmissions.map(s => ({
          id: s.id,
          event_id: s.event_id,
          status: s.status,
          score: s.score,
          submitted_at: s.submitted_at || "",
          admin_comments: s.admin_comments,
          events: s.events
        }));
        setSubmissions(demoSchoolSubmissions);
      }
    } catch (error: any) {
      // Fallback to demo data on error
      const demoSchoolSubmissions = demoSubmissions.map(s => ({
        id: s.id,
        event_id: s.event_id,
        status: s.status,
        score: s.score,
        submitted_at: s.submitted_at || "",
        admin_comments: s.admin_comments,
        events: s.events
      }));
      setSubmissions(demoSchoolSubmissions);
      console.error("Using demo data:", error);
    } finally {
      setLoading(false);
    }
  };

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
      label: "Average Score",
      value: submissions.filter(s => s.score).length > 0
        ? (submissions.reduce((sum, s) => sum + (s.score || 0), 0) / submissions.filter(s => s.score).length).toFixed(1)
        : "N/A",
      icon: Award,
      color: "text-purple-600 bg-purple-500/10"
    }
  ];

  return (
    <SchoolLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            My Submissions
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your submitted activity reports and their status
          </p>
        </div>

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
            <CardTitle>Submission History</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading submissions...
              </div>
            ) : submissions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No submissions yet</p>
                <Button onClick={() => navigate("/school/activities")} className="gap-2">
                  Browse Activities
                </Button>
              </div>
            ) : (
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
                              <p className="font-medium">{submission.events.title}</p>
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
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(submission.submitted_at).toLocaleDateString()}
                              </div>
                              {submission.score && (
                                <div className="flex items-center gap-1 text-primary">
                                  <Award className="w-4 h-4" />
                                  Score: {submission.score}
                                </div>
                              )}
                            </div>
                            {submission.admin_comments && (
                              <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                                <p className="font-medium text-xs text-muted-foreground mb-1">Admin Comments:</p>
                                <p>{submission.admin_comments}</p>
                              </div>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/school/submission/${submission.id}`)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </Button>
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
            )}
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
};

export default SchoolSubmissions;
