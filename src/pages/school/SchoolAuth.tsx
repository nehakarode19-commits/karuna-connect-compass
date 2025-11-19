import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255, { message: "Email too long" }),
  fullName: z.string().trim().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name too long" }).optional(),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }).max(100, { message: "Password too long" })
});

const SchoolAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signUp, signIn } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate input
      const validationData = isSignUp 
        ? { email: formData.email, fullName: formData.fullName, password: formData.password }
        : { email: formData.email, password: formData.password };
      
      const validated = authSchema.parse(validationData);
      
      if (isSignUp) {
        const { error } = await signUp(validated.email, validated.password, validated.fullName || "");
        if (error) {
          if (error.message?.includes("already registered")) {
            throw new Error("This email is already registered. Please login instead.");
          }
          throw error;
        }
        
        toast({
          title: "Account Created",
          description: "Welcome! Redirecting to dashboard...",
        });
        navigate("/school/dashboard");
      } else {
        const { error } = await signIn(validated.email, validated.password);
        if (error) {
          if (error.message?.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password. Please try again.");
          }
          throw error;
        }
        
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
        navigate("/school/dashboard");
      }
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
          description: error.message || "An error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4">
        <Card className="w-full max-w-md shadow-strong border-border">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-hero flex items-center justify-center mx-auto">
              <GraduationCap className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {isSignUp ? "School Registration" : "School Login"}
              </CardTitle>
              <CardDescription className="text-base mt-2">
                {isSignUp 
                  ? "Create an account for your Karuna Club"
                  : "Login to access your school dashboard"
                }
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="school@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Principal's Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-hero border-0"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isSignUp ? "Creating account..." : "Signing in..."}
                  </>
                ) : (
                  isSignUp ? "Create Account" : "Sign In"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "New to Karuna?"}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setFormData({ email: "", fullName: "", password: "" });
                }}
              >
                {isSignUp ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Complete your school profile after signup to start submitting activities
              </p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Admin access?{" "}
                <button
                  onClick={() => navigate("/admin/login")}
                  className="text-primary hover:underline font-medium"
                >
                  Click here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SchoolAuth;
