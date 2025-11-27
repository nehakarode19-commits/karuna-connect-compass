import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Plus, Search, MapPin, Phone, Mail, Edit, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const schoolFormSchema = z.object({
  kcNo: z.string().trim().max(50).optional(),
  schoolName: z.string().trim().min(2, "School name is required").max(200),
  kendraName: z.string().trim().min(2, "Kendra name is required").max(200),
  principalName: z.string().trim().min(2, "Principal name is required").max(100),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),
  schoolEmail: z.string().email("Invalid email address").max(255),
  teacherName: z.string().trim().min(2, "Teacher name is required").max(100),
  teacherMobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  teacherEmail: z.string().email("Invalid email address").max(255),
});

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
  const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
  const [formData, setFormData] = useState({
    kcNo: "",
    schoolName: "",
    kendraName: "",
    principalName: "",
    contactNumber: "",
    schoolEmail: "",
    teacherName: "",
    teacherMobile: "",
    teacherEmail: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
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

  const handleAddSchool = async () => {
    try {
      schoolFormSchema.parse(formData);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add schools",
          variant: "destructive",
        });
        return;
      }

      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .insert({
          kc_no: formData.kcNo || `KC${Date.now()}`,
          school_name: formData.schoolName,
          principal_name: formData.principalName,
          contact_number: formData.contactNumber,
          email: formData.schoolEmail,
          kendra_name: formData.kendraName,
          status: 'approved',
          approved_at: new Date().toISOString(),
          user_id: user.id,
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      const { error: teacherError } = await supabase
        .from("teachers")
        .insert({
          school_id: schoolData.id,
          name: formData.teacherName,
          mobile: formData.teacherMobile,
          email: formData.teacherEmail,
          academic_year: new Date().getFullYear().toString(),
          is_current: true,
        });

      if (teacherError) throw teacherError;

      toast({
        title: "Success",
        description: "School added successfully",
      });
      
      setFormData({
        kcNo: "",
        schoolName: "",
        kendraName: "",
        principalName: "",
        contactNumber: "",
        schoolEmail: "",
        teacherName: "",
        teacherMobile: "",
        teacherEmail: "",
      });
      setShowAddSchoolForm(false);
      fetchSchools();
      fetchStats();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add school",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <Button className="gap-2 bg-gradient-hero border-0" onClick={() => setShowAddSchoolForm(true)}>
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
                <Button onClick={() => setShowAddSchoolForm(true)} className="gap-2">
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

      {/* Add School Form Dialog */}
      <Dialog open={showAddSchoolForm} onOpenChange={setShowAddSchoolForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add School</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* School and Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">School and Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kcNo">
                    KC No <span className="text-xs text-muted-foreground">(call KC Hango at 67348 82288)</span>
                  </Label>
                  <Input
                    id="kcNo"
                    placeholder="KC No"
                    value={formData.kcNo}
                    onChange={(e) => setFormData({ ...formData, kcNo: e.target.value })}
                    className={formErrors.kcNo ? "border-destructive" : ""}
                  />
                  {formErrors.kcNo && (
                    <p className="text-sm text-destructive">{formErrors.kcNo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">
                    School Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="schoolName"
                    placeholder="School Name"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className={formErrors.schoolName ? "border-destructive" : ""}
                  />
                  {formErrors.schoolName && (
                    <p className="text-sm text-destructive">{formErrors.schoolName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kendraName">
                    Nearest Karuna Kendra Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="kendraName"
                    placeholder="Nearest Karuna Kendra Name"
                    value={formData.kendraName}
                    onChange={(e) => setFormData({ ...formData, kendraName: e.target.value })}
                    className={formErrors.kendraName ? "border-destructive" : ""}
                  />
                  {formErrors.kendraName && (
                    <p className="text-sm text-destructive">{formErrors.kendraName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalName">
                    School Principal's Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="principalName"
                    placeholder="School Principal's Name"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className={formErrors.principalName ? "border-destructive" : ""}
                  />
                  {formErrors.principalName && (
                    <p className="text-sm text-destructive">{formErrors.principalName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">
                    School Contact Number<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactNumber"
                    placeholder="School Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={formErrors.contactNumber ? "border-destructive" : ""}
                  />
                  {formErrors.contactNumber && (
                    <p className="text-sm text-destructive">{formErrors.contactNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">
                    School Email ID<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    placeholder="School Email ID"
                    value={formData.schoolEmail}
                    onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                    className={formErrors.schoolEmail ? "border-destructive" : ""}
                  />
                  {formErrors.schoolEmail && (
                    <p className="text-sm text-destructive">{formErrors.schoolEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Karuna Club Teacher In-charge Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Karuna Club Teacher In-charge</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">
                    Name<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="teacherName"
                    placeholder="Karuna Club Teacher In-charge Name"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    className={formErrors.teacherName ? "border-destructive" : ""}
                  />
                  {formErrors.teacherName && (
                    <p className="text-sm text-destructive">{formErrors.teacherName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherMobile">
                    Mobile Number<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="teacherMobile"
                    placeholder="Mobile Number"
                    value={formData.teacherMobile}
                    onChange={(e) => setFormData({ ...formData, teacherMobile: e.target.value })}
                    className={formErrors.teacherMobile ? "border-destructive" : ""}
                  />
                  {formErrors.teacherMobile && (
                    <p className="text-sm text-destructive">{formErrors.teacherMobile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">
                    Email ID<span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="Email ID"
                    value={formData.teacherEmail}
                    onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                    className={formErrors.teacherEmail ? "border-destructive" : ""}
                  />
                  {formErrors.teacherEmail && (
                    <p className="text-sm text-destructive">{formErrors.teacherEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddSchoolForm(false);
                setFormData({
                  kcNo: "",
                  schoolName: "",
                  kendraName: "",
                  principalName: "",
                  contactNumber: "",
                  schoolEmail: "",
                  teacherName: "",
                  teacherMobile: "",
                  teacherEmail: "",
                });
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSchool} disabled={loading} className="bg-primary">
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSchools;
