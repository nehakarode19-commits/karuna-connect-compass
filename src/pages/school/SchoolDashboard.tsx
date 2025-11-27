import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, Clock, CheckCircle, AlertCircle, XCircle, TrendingUp, FileText } from "lucide-react";
import { SchoolLayout } from "./SchoolLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  thumbnail_url: string;
}

interface Submission {
  id: string;
  status: string;
  score: number | null;
  submitted_at: string | null;
  events: {
    title: string;
  };
}

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [schoolData, setSchoolData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      // Fetch school data
      const { data: school, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (schoolError) throw schoolError;
      setSchoolData(school);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: true })
        .limit(3);

      if (eventsError) throw eventsError;
      setEvents(eventsData || []);

      // Fetch submissions
      if (school) {
        const { data: submissionsData, error: submissionsError } = await supabase
          .from("event_submissions")
          .select(`
            id,
            status,
            score,
            submitted_at,
            events (title)
          `)
          .eq("school_id", school.id)
          .order("submitted_at", { ascending: false })
          .limit(5);

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

  const getSubmissionStats = () => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };
  };

  const stats = getSubmissionStats();

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: "bg-yellow-500", icon: Clock, label: "Pending" },
      approved: { color: "bg-green-500", icon: CheckCircle, label: "Approved" },
      rejected: { color: "bg-red-500", icon: XCircle, label: "Rejected" },
      revision_requested: { color: "bg-blue-500", icon: AlertCircle, label: "Revision Requested" },
    };

    const { color, icon: Icon, label } = config[status] || config.pending;

    return (
      <Badge className={`${color} text-white flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {label}
      </Badge>
    );
  };

  return (
    <SchoolLayout>
      <div className="space-y-6 p-4 md:p-0">
        {/* Welcome Header */}
        <div className="bg-gradient-hero text-primary-foreground p-6 md:p-8 rounded-xl shadow-medium">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome, {schoolData?.school_name || "School"}!
          </h1>
          <p className="text-primary-foreground/90">
            Track your activities and manage submissions
          </p>
        </div>

        {/* Quick Action Buttons - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button 
            onClick={() => navigate("/school/activities")}
            className="h-auto py-6 flex-col gap-2 bg-gradient-hero border-0 shadow-medium hover:shadow-strong transition-shadow"
          >
            <Calendar className="w-8 h-8" />
            <span className="text-base font-semibold">View Activities</span>
          </Button>
          <Button 
            onClick={() => navigate("/school/activities")}
            variant="outline"
            className="h-auto py-6 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/5"
          >
            <Plus className="w-8 h-8" />
            <span className="text-base font-semibold">Submit Report</span>
          </Button>
          <Button 
            onClick={() => navigate("/school/submissions")}
            variant="outline"
            className="h-auto py-6 flex-col gap-2 border-2 hover:border-primary hover:bg-primary/5"
          >
            <FileText className="w-8 h-8" />
            <span className="text-base font-semibold">My Submissions</span>
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Total</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-yellow-600">{stats.pending}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-4 md:p-6">
              <div className="text-center">
                <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="text-2xl md:text-3xl font-bold text-primary">{events.length}</p>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">Activities</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Submissions Widget */}
        {submissions.length > 0 && (
          <Card className="shadow-medium border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Submissions</CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate("/school/submissions")}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{submission.events.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted: {submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {submission.score !== null && (
                        <div className="text-right">
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-lg font-bold text-primary">{submission.score}/100</p>
                        </div>
                      )}
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events Widget */}
        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Activities
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate("/school/activities")}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Loading activities...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No activities available</p>
                </div>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                    {event.thumbnail_url && (
                      <div className="aspect-video w-full overflow-hidden bg-muted">
                        <img
                          src={event.thumbnail_url}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-5">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{new Date(event.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <Button 
                        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                        onClick={() => navigate(`/school/submit/${event.id}`)}
                      >
                        <Plus className="w-4 h-4" />
                        Submit Report
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
};

export default SchoolDashboard;
