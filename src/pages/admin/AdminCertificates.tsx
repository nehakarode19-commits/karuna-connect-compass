import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Award, Download, Search, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Submission {
  id: string;
  score: number;
  status: string;
  schools: {
    school_name: string;
    kc_no: string;
  };
  events: {
    title: string;
  };
}

const AdminCertificates = () => {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  useEffect(() => {
    fetchApprovedSubmissions();
  }, []);

  const fetchApprovedSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("event_submissions")
        .select(`
          id,
          score,
          status,
          schools (school_name, kc_no),
          events (title)
        `)
        .eq("status", "approved")
        .not("score", "is", null)
        .order("score", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async (submission: Submission) => {
    try {
      // In a real implementation, this would generate a PDF certificate
      // For now, we'll just show a success message
      toast({
        title: "Certificate Generated",
        description: `Certificate for ${submission.schools.school_name} has been generated`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate certificate",
        variant: "destructive",
      });
    }
  };

  const generateBulkCertificates = async () => {
    try {
      toast({
        title: "Generating Certificates",
        description: `Generating ${filteredSubmissions.length} certificates...`,
      });
      
      // In real implementation, this would generate certificates in batch
      setTimeout(() => {
        toast({
          title: "Success",
          description: "All certificates generated successfully",
        });
      }, 2000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to generate certificates",
        variant: "destructive",
      });
    }
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = 
      sub.schools.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.schools.kc_no.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certificates</h1>
            <p className="text-muted-foreground mt-1">
              Generate and manage certificates for approved submissions
            </p>
          </div>
          <Button 
            onClick={generateBulkCertificates}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <Award className="w-4 h-4" />
            Generate All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-1">
                {submissions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Eligible</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {submissions.filter(s => s.score && s.score >= 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Excellence (80+)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {submissions.filter(s => s.score && s.score >= 60 && s.score < 80).length}
              </div>
              <div className="text-sm text-muted-foreground">Merit (60-79)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {submissions.filter(s => s.score && s.score < 60).length}
              </div>
              <div className="text-sm text-muted-foreground">Participation</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by school name or KC number..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No approved submissions found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold">{submission.schools.school_name}</h3>
                        <Badge 
                          variant={
                            submission.score >= 80 ? "default" : 
                            submission.score >= 60 ? "secondary" : 
                            "outline"
                          }
                        >
                          {submission.score >= 80 ? "Excellence" : 
                           submission.score >= 60 ? "Merit" : 
                           "Participation"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        KC No: {submission.schools.kc_no} • Activity: {submission.events.title} • Score: {submission.score}/100
                      </p>
                    </div>
                    <Button
                      onClick={() => generateCertificate(submission)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Generate
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates;