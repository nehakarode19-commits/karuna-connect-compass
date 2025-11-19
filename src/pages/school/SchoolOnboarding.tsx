import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, InfoIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SchoolOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [schoolData, setSchoolData] = useState({
    kcNo: "",
    schoolName: "",
    principalName: "",
    contactNumber: "",
    email: "",
    kendraName: ""
  });

  const [teacherData, setTeacherData] = useState({
    name: "",
    mobile: "",
    email: ""
  });

  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("schools")
        .insert({
          user_id: user?.id,
          kc_no: schoolData.kcNo,
          school_name: schoolData.schoolName,
          principal_name: schoolData.principalName,
          contact_number: schoolData.contactNumber,
          email: schoolData.email,
          kendra_name: schoolData.kendraName,
          status: 'pending',
          onboarding_completed: false
        });

      if (error) throw error;

      toast({
        title: "School Details Saved",
        description: "Now let's add teacher details.",
      });
      setStep(2);
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

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: school } = await supabase
        .from("schools")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (!school) throw new Error("School not found");

      const { error: teacherError } = await supabase
        .from("teachers")
        .insert({
          school_id: school.id,
          name: teacherData.name,
          mobile: teacherData.mobile,
          email: teacherData.email,
          academic_year: new Date().getFullYear().toString()
        });

      if (teacherError) throw teacherError;

      const { error: updateError } = await supabase
        .from("schools")
        .update({ onboarding_completed: true })
        .eq("id", school.id);

      if (updateError) throw updateError;

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({
          user_id: user?.id,
          role: "school_admin"
        });

      if (roleError && !roleError.message.includes("duplicate")) throw roleError;

      toast({
        title: "Onboarding Complete",
        description: "Welcome to Karuna Platform!",
      });
      navigate("/school/dashboard");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-2xl shadow-strong border-border">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto">
            <GraduationCap className="w-10 h-10 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">
              {step === 1 ? "School Details" : "Teacher In-Charge Details"}
            </CardTitle>
            <CardDescription className="text-base mt-2">
              Step {step} of 2
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form onSubmit={handleSchoolSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="kcNo">KC No *</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <InfoIcon className="w-4 h-4 text-muted-foreground cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>For help, call Mr. Elango at 63749 82288</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <Input
                  id="kcNo"
                  value={schoolData.kcNo}
                  onChange={(e) => setSchoolData({ ...schoolData, kcNo: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={schoolData.schoolName}
                  onChange={(e) => setSchoolData({ ...schoolData, schoolName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="principalName">Principal's Name *</Label>
                <Input
                  id="principalName"
                  value={schoolData.principalName}
                  onChange={(e) => setSchoolData({ ...schoolData, principalName: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number *</Label>
                <Input
                  id="contactNumber"
                  type="tel"
                  value={schoolData.contactNumber}
                  onChange={(e) => setSchoolData({ ...schoolData, contactNumber: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolEmail">Email ID *</Label>
                <Input
                  id="schoolEmail"
                  type="email"
                  value={schoolData.email}
                  onChange={(e) => setSchoolData({ ...schoolData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kendraName">Nearest Karuna Kendra Name *</Label>
                <Input
                  id="kendraName"
                  value={schoolData.kendraName}
                  onChange={(e) => setSchoolData({ ...schoolData, kendraName: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-hero border-0"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save & Continue"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Name *</Label>
                <Input
                  id="teacherName"
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherMobile">Mobile Number *</Label>
                <Input
                  id="teacherMobile"
                  type="tel"
                  value={teacherData.mobile}
                  onChange={(e) => setTeacherData({ ...teacherData, mobile: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teacherEmail">Email ID *</Label>
                <Input
                  id="teacherEmail"
                  type="email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-hero border-0"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SchoolOnboarding;
