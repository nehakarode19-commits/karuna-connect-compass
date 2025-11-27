import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Phone, Mail, Edit, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface School {
  id: string;
  kc_no: string;
  school_name: string;
  principal_name: string;
  contact_number: string;
  email: string;
  kendra_name: string;
  chapter_id?: string;
}

interface Stats {
  totalSchools: number;
  totalStudents: number;
  totalSubmissions: number;
  totalChapters: number;
}

const AdminSchools = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalSchools: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    totalChapters: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchSchools();
    fetchStats();
  }, []);

  const fetchSchools = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("schools")
        .select("*")
        .eq("status", "approved")
        .order("school_name");

      if (error) throw error;
      setSchools(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching schools",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [schoolsCount, studentsCount, submissionsCount, chaptersCount] = await Promise.all([
        supabase.from("schools").select("id", { count: "exact", head: true }),
        supabase.from("students").select("id", { count: "exact", head: true }),
        supabase.from("event_submissions").select("id", { count: "exact", head: true }),
        supabase.from("chapters").select("id", { count: "exact", head: true })
      ]);

      setStats({
        totalSchools: schoolsCount.count || 0,
        totalStudents: studentsCount.count || 0,
        totalSubmissions: submissionsCount.count || 0,
        totalChapters: chaptersCount.count || 0
      });
    } catch (error: any) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleDeleteSchool = async (schoolId: string, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete ${schoolName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("schools")
        .delete()
        .eq("id", schoolId);

      if (error) throw error;

      toast({
        title: "School deleted successfully",
      });
      fetchSchools();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error deleting school",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredSchools = schools.filter(
    (school) =>
      school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.kc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.kendra_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Schools Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all Karuna Clubs • {stats.totalSchools} schools • {stats.totalStudents} active students
            </p>
          </div>
          <Button className="gap-2 bg-gradient-hero border-0" onClick={() => navigate("/admin/school-approvals")}>
            <Plus className="w-4 h-4" />
            Add School
          </Button>
        </div>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">{stats.totalSchools}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Schools</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-3xl font-bold text-green-600">{stats.totalStudents}</div>
                <div className="text-sm text-muted-foreground mt-1">Active Students</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">{stats.totalSubmissions}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Submissions</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">{stats.totalChapters}</div>
                <div className="text-sm text-muted-foreground mt-1">Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by school name, KC No, or kendra..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        ) : filteredSchools.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">
                {searchTerm ? "No schools found matching your search" : "No schools registered yet"}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate("/admin/school-approvals")} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add First School
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-all hover:border-primary/50 group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                        {school.school_name}
                      </h3>
                      <Badge variant="secondary" className="shrink-0">
                        {school.kc_no}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Principal:</span> {school.principal_name}
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{school.kendra_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span>{school.contact_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{school.email}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => navigate(`/admin/school-approvals`)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleDeleteSchool(school.id, school.school_name)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSchools;
