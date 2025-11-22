import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EvaluatorLayout } from "./EvaluatorLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Submission {
  id: string;
  status: string;
  score: number | null;
  submitted_at: string;
  schools: {
    school_name: string;
    kc_no: string;
  };
  events: {
    title: string;
  };
}

const EvaluatorSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("event_submissions")
        .select(`
          *,
          schools (school_name, kc_no),
          events (title)
        `)
        .order("submitted_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
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

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.schools.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.schools.kc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      submission.events.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
  };

  const stats = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === "pending").length,
    approved: submissions.filter(s => s.status === "approved").length,
    rejected: submissions.filter(s => s.status === "rejected").length,
  };

  return (
    <EvaluatorLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Review Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Evaluate and score school activity submissions
          </p>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by school, KC number, or activity..."
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={statusFilter} onValueChange={setStatusFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="space-y-4 mt-6">
            {loading ? (
              <div className="text-center py-12">Loading submissions...</div>
            ) : filteredSubmissions.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground">No submissions found</p>
              </Card>
            ) : (
              filteredSubmissions.map((submission) => (
                <Card key={submission.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{submission.schools.school_name}</h3>
                          {getStatusBadge(submission.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">KC No: {submission.schools.kc_no}</p>
                        <p className="text-sm text-muted-foreground mb-1">Activity: {submission.events.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                        {submission.score !== null && (
                          <p className="text-sm font-medium mt-2">Score: {submission.score}/100</p>
                        )}
                      </div>
                      <Button
                        onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                        size="sm"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </EvaluatorLayout>
  );
};

export default EvaluatorSubmissions;
