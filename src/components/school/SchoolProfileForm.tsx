import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, School, User, Phone, Mail, MapPin } from "lucide-react";
import { z } from "zod";

const schoolSchema = z.object({
  kc_no: z.string().trim().min(1, { message: "KC No is required" }).max(50),
  school_name: z.string().trim().min(2, { message: "School name is required" }).max(200),
  principal_name: z.string().trim().min(2, { message: "Principal name is required" }).max(100),
  contact_number: z.string().trim().min(10, { message: "Valid contact number required" }).max(15),
  email: z.string().trim().email({ message: "Valid email required" }).max(255),
  kendra_name: z.string().trim().min(2, { message: "Kendra name is required" }).max(100),
});

const teacherSchema = z.object({
  name: z.string().trim().min(2, { message: "Teacher name is required" }).max(100),
  mobile: z.string().trim().min(10, { message: "Valid mobile number required" }).max(15),
  email: z.string().trim().email({ message: "Valid email required" }).max(255),
});

export function SchoolProfileForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);
  const [hasExistingData, setHasExistingData] = useState(false);
  
  const [schoolData, setSchoolData] = useState({
    kc_no: "",
    school_name: "",
    principal_name: "",
    contact_number: "",
    email: "",
    kendra_name: "",
  });

  const [teacherData, setTeacherData] = useState({
    name: "",
    mobile: "",
    email: "",
  });

  useEffect(() => {
    fetchExistingData();
  }, []);

  const fetchExistingData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: school } = await supabase
        .from("schools")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (school) {
        setHasExistingData(true);
        setSchoolData({
          kc_no: school.kc_no,
          school_name: school.school_name,
          principal_name: school.principal_name,
          contact_number: school.contact_number,
          email: school.email,
          kendra_name: school.kendra_name,
        });

        const { data: teacher } = await supabase
          .from("teachers")
          .select("*")
          .eq("school_id", school.id)
          .eq("is_current", true)
          .maybeSingle();

        if (teacher) {
          setTeacherData({
            name: teacher.name,
            mobile: teacher.mobile,
            email: teacher.email,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate school data
      const validatedSchool = schoolSchema.parse(schoolData);
      const validatedTeacher = teacherSchema.parse(teacherData);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Insert or update role
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert({ 
          user_id: user.id, 
          role: 'school_admin' 
        }, { 
          onConflict: 'user_id,role' 
        });

      if (roleError) throw roleError;

      // Check if school exists
      const { data: existingSchool } = await supabase
        .from("schools")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let schoolId: string;

      if (existingSchool) {
        // Update existing school
        const { error: schoolError } = await supabase
          .from("schools")
          .update({
            kc_no: validatedSchool.kc_no,
            school_name: validatedSchool.school_name,
            principal_name: validatedSchool.principal_name,
            contact_number: validatedSchool.contact_number,
            email: validatedSchool.email,
            kendra_name: validatedSchool.kendra_name,
            onboarding_completed: true,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingSchool.id);

        if (schoolError) throw schoolError;
        schoolId = existingSchool.id;
      } else {
        // Insert new school
        const { data: newSchool, error: schoolError } = await supabase
          .from("schools")
          .insert([{
            kc_no: validatedSchool.kc_no,
            school_name: validatedSchool.school_name,
            principal_name: validatedSchool.principal_name,
            contact_number: validatedSchool.contact_number,
            email: validatedSchool.email,
            kendra_name: validatedSchool.kendra_name,
            user_id: user.id,
            onboarding_completed: true,
            status: 'pending',
          }])
          .select()
          .single();

        if (schoolError) throw schoolError;
        schoolId = newSchool.id;
      }

      // Mark old teachers as not current
      await supabase
        .from("teachers")
        .update({ is_current: false })
        .eq("school_id", schoolId);

      // Insert new teacher
      const currentYear = new Date().getFullYear();
      const { error: teacherError } = await supabase
        .from("teachers")
        .insert([{
          name: validatedTeacher.name,
          mobile: validatedTeacher.mobile,
          email: validatedTeacher.email,
          school_id: schoolId,
          academic_year: `${currentYear}-${currentYear + 1}`,
          is_current: true,
        }]);

      if (teacherError) throw teacherError;

      toast({
        title: "Profile Saved",
        description: "Your school profile has been saved successfully.",
      });

      setHasExistingData(true);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to save profile. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetchingData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Profile</CardTitle>
        <CardDescription>
          {hasExistingData 
            ? "Update your school and teacher information" 
            : "Complete your school profile to start submitting activities"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <School className="w-5 h-5" />
              School Details
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="kc_no">KC No *</Label>
                <Input
                  id="kc_no"
                  value={schoolData.kc_no}
                  onChange={(e) => setSchoolData({ ...schoolData, kc_no: e.target.value })}
                  placeholder="e.g., AHM-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_name">School Name *</Label>
                <Input
                  id="school_name"
                  value={schoolData.school_name}
                  onChange={(e) => setSchoolData({ ...schoolData, school_name: e.target.value })}
                  placeholder="Enter school name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principal_name">Principal's Name *</Label>
                <Input
                  id="principal_name"
                  value={schoolData.principal_name}
                  onChange={(e) => setSchoolData({ ...schoolData, principal_name: e.target.value })}
                  placeholder="Enter principal's name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact_number">Contact Number *</Label>
                <Input
                  id="contact_number"
                  type="tel"
                  value={schoolData.contact_number}
                  onChange={(e) => setSchoolData({ ...schoolData, contact_number: e.target.value })}
                  placeholder="10-digit number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="school_email">School Email *</Label>
                <Input
                  id="school_email"
                  type="email"
                  value={schoolData.email}
                  onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                  placeholder="school@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kendra_name">Nearest Karuna Kendra *</Label>
                <Input
                  id="kendra_name"
                  value={schoolData.kendra_name}
                  onChange={(e) => setSchoolData({ ...schoolData, kendra_name: e.target.value })}
                  placeholder="Enter Kendra name"
                  required
                />
              </div>
            </div>
          </div>

          {/* Teacher Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Teacher In-Charge (Current Academic Year)
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="teacher_name">Name *</Label>
                <Input
                  id="teacher_name"
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                  placeholder="Enter teacher's name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacher_mobile">Mobile Number *</Label>
                <Input
                  id="teacher_mobile"
                  type="tel"
                  value={teacherData.mobile}
                  onChange={(e) => setTeacherData({ ...teacherData, mobile: e.target.value })}
                  placeholder="10-digit number"
                  required
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="teacher_email">Email *</Label>
                <Input
                  id="teacher_email"
                  type="email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  placeholder="teacher@example.com"
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
