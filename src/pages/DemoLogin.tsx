import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Shield, School, ArrowRight, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const DemoLogin = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const handleQuickLogin = async (role: "admin" | "school" | "evaluator") => {
    setLoading(role);
    
    try {
      const credentials = {
        admin: {
          email: "admin@universal-software.com",
          password: "123456",
          fullName: "Admin User"
        },
        school: {
          email: "school@demo.com",
          password: "123456",
          fullName: "Demo School"
        },
        evaluator: {
          email: "evaluator@demo.com",
          password: "123456",
          fullName: "Demo Evaluator"
        }
      };

      const { email, password, fullName } = credentials[role];
      
      // Step 1: Show we're starting
      toast({
        title: "Step 1: Authenticating",
        description: `Checking credentials for ${email}...`,
      });

      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Try to sign in first
      let { error: signInError } = await signIn(email, password);
      
      // If user doesn't exist, create account
      if (signInError?.message?.includes("Invalid login credentials")) {
        toast({
          title: "Step 2: Creating Demo Account",
          description: "Setting up your demo account with dummy data...",
        });

        await new Promise(resolve => setTimeout(resolve, 800));

        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;

        // Sign in after creating account
        const { error: newSignInError } = await signIn(email, password);
        if (newSignInError) throw newSignInError;

        toast({
          title: "Step 3: Setting Up Role",
          description: `Assigning ${role} permissions...`,
        });

        await new Promise(resolve => setTimeout(resolve, 800));

        // Set role for the new user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("user_roles").insert({
            user_id: user.id,
            role: role === "admin" ? "admin" : role === "evaluator" ? "evaluator" : "school_admin"
          });

          // If school, create school profile
          if (role === "school") {
            toast({
              title: "Step 4: Creating School Profile",
              description: "Adding school details with dummy data...",
            });

            await new Promise(resolve => setTimeout(resolve, 800));

            await supabase.from("profiles").upsert({
              id: user.id,
              email: user.email!,
              full_name: fullName
            });

            await supabase.from("schools").insert({
              user_id: user.id,
              kc_no: "DEMO001",
              school_name: "Demo School",
              principal_name: "Demo Principal",
              contact_number: "+91 9876543210",
              email: user.email!,
              kendra_name: "Demo Kendra",
              status: "approved",
              onboarding_completed: true
            });
          }
        }
      } else if (signInError) {
        throw signInError;
      } else {
        toast({
          title: "Step 2: Account Found",
          description: "Logging in with existing demo account...",
        });
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      toast({
        title: "✓ Login Successful",
        description: `Welcome! Redirecting to ${role === "admin" ? "Administrator" : role === "evaluator" ? "Evaluator" : "School"} portal...`,
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      navigate(role === "admin" ? "/admin/dashboard" : role === "evaluator" ? "/evaluator/dashboard" : "/school/dashboard");
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-5xl space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Zap className="w-4 h-4" />
            Quick Demo Access - Accounts auto-created on first login
          </div>
          <h1 className="text-4xl font-bold">Karuna Platform Demo</h1>
          <p className="text-muted-foreground text-lg">
            Choose your role to explore the platform instantly - no setup required
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Admin Login Card */}
          <Card className="relative overflow-hidden border-2 hover:shadow-2xl transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl text-center">Admin Portal</CardTitle>
              <CardDescription className="text-center">
                Full administrative access to manage schools, activities, and donations
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Manage 2,500+ schools</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Review activity submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Generate reports & leaderboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>Track donations & receipts</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => handleQuickLogin("admin")}
                  disabled={loading !== null}
                  className="w-full bg-gradient-to-r from-primary to-primary/80 group"
                  size="lg"
                >
                  {loading === "admin" ? (
                    "Logging in..."
                  ) : (
                    <>
                      Quick Login as Admin
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/admin/login")}
                  className="w-full"
                  disabled={loading !== null}
                >
                  Manual Login
                </Button>
              </div>

              <div className="pt-2 text-xs text-center text-muted-foreground space-y-1">
                <p className="font-mono">admin@universal-software.com</p>
                <p className="font-mono">Password: 123456</p>
              </div>
            </CardContent>
          </Card>

          {/* School Login Card */}
          <Card className="relative overflow-hidden border-2 hover:shadow-2xl transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-4">
                <School className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-center">School Portal</CardTitle>
              <CardDescription className="text-center">
                Access your school dashboard to manage activities and submissions
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>View assigned activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Submit activity reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Track submission status</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span>Manage school profile</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => handleQuickLogin("school")}
                  disabled={loading !== null}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 group"
                  size="lg"
                >
                  {loading === "school" ? (
                    "Logging in..."
                  ) : (
                    <>
                      Quick Login as School
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/school/auth")}
                  className="w-full"
                  disabled={loading !== null}
                >
                  Manual Login / Sign Up
                </Button>
              </div>

              <div className="pt-2 text-xs text-center text-muted-foreground space-y-1">
                <p className="font-mono">school@demo.com</p>
                <p className="font-mono">Password: 123456</p>
              </div>
            </CardContent>
          </Card>

          {/* Evaluator Login Card */}
          <Card className="relative overflow-hidden border-2 hover:shadow-2xl transition-all group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-center">Evaluator Portal</CardTitle>
              <CardDescription className="text-center">
                Review and score school activity submissions with evaluation tools
              </CardDescription>
            </CardHeader>
            <CardContent className="relative space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Review all submissions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Score & grade activities</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>View leaderboards</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  <span>Track school performance</span>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <Button 
                  onClick={() => handleQuickLogin("evaluator")}
                  disabled={loading !== null}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 group"
                  size="lg"
                >
                  {loading === "evaluator" ? (
                    "Logging in..."
                  ) : (
                    <>
                      Quick Login as Evaluator
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-2 text-xs text-center text-muted-foreground space-y-1">
                <p className="font-mono">evaluator@demo.com</p>
                <p className="font-mono">Password: 123456</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-muted-foreground"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DemoLogin;
