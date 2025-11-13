import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Users, 
  TrendingUp, 
  Award, 
  Heart, 
  FileText,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: GraduationCap,
      title: "Smart School Management",
      description: "Centralized platform for 2,500+ schools with seamless onboarding and student roster management"
    },
    {
      icon: Users,
      title: "Student Excellence",
      description: "Engage 10,000+ students annually with online exams, instant results, and digital certificates"
    },
    {
      icon: TrendingUp,
      title: "Activity Tracking",
      description: "Track value-based activities with multimedia submissions and automated performance rankings"
    },
    {
      icon: Heart,
      title: "Donation Management",
      description: "Streamlined donation processing with automated receipts and comprehensive reporting"
    },
    {
      icon: Award,
      title: "Recognition System",
      description: "Auto-generated leaderboards, certificates, and awards to celebrate achievements"
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description: "Structured reports across schools, events, and cities with powerful analytics"
    }
  ];

  const stats = [
    { value: "2,500+", label: "Schools Connected" },
    { value: "12,000+", label: "Students Engaged" },
    { value: "100%", label: "Digital Tracking" },
    { value: "24/7", label: "Platform Access" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">Karuna Platform</span>
            </div>
            <Button onClick={() => navigate("/login")} className="bg-gradient-hero border-0">
              Login <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 py-20 md:py-32 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Heart className="w-4 h-4" />
              Empowering Value-Based Education
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Transform Educational
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Management</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A comprehensive digital platform connecting schools, students, and communities 
              through value-based education, online assessments, and meaningful engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-hero border-0 shadow-medium hover:shadow-strong transition-all"
              >
                Explore Dashboard
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-card border-y border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Everything You Need in One Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to streamline operations and enhance educational outcomes
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-medium transition-all duration-300 border-border bg-gradient-card">
                  <div className="w-12 h-12 rounded-lg bg-gradient-hero flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-hero opacity-95" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Join 2,500+ schools already transforming education through our platform
            </p>
            <div className="space-y-4">
              <Button 
                size="lg" 
                onClick={() => navigate("/login")}
                className="bg-background text-foreground hover:bg-background/90 shadow-strong"
              >
                Access Platform
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <div className="flex items-center justify-center gap-6 text-primary-foreground/90 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Secure & Reliable
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  24/7 Support
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Easy Setup
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-hero flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground">Karuna International</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 Karuna International. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
