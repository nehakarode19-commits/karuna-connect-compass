import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  School, 
  Users, 
  FileText, 
  Heart,
  TrendingUp,
  Award,
  Calendar,
  Bell,
  LogOut,
  GraduationCap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Total Schools",
      value: "2,547",
      change: "+12 this month",
      icon: School,
      color: "text-primary"
    },
    {
      title: "Active Students",
      value: "11,234",
      change: "+456 this week",
      icon: Users,
      color: "text-secondary"
    },
    {
      title: "Completed Exams",
      value: "3,421",
      change: "85% completion rate",
      icon: FileText,
      color: "text-accent"
    },
    {
      title: "Total Donations",
      value: "₹12.4L",
      change: "+₹45K this month",
      icon: Heart,
      color: "text-primary"
    }
  ];

  const recentActivities = [
    { title: "New school onboarded", school: "St. Mary's High School", time: "2 hours ago" },
    { title: "Exam completed", school: "Delhi Public School", time: "4 hours ago" },
    { title: "Activity submitted", school: "Modern High School", time: "1 day ago" },
    { title: "Donation received", school: "Anonymous Donor", time: "2 days ago" }
  ];

  const upcomingEvents = [
    { title: "Q1 Examination", date: "15 Jan 2024", participants: "8,500 students" },
    { title: "Monthly Activity Report", date: "20 Jan 2024", participants: "All schools" },
    { title: "Award Ceremony", date: "30 Jan 2024", participants: "Top 100 students" }
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
              <div>
                <span className="text-xl font-bold text-foreground">Karuna Platform</span>
                <p className="text-xs text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="w-5 h-5" />
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/")}
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, Administrator
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your platform today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border bg-gradient-card hover:shadow-medium transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activities */}
          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Recent Activities
              </CardTitle>
              <CardDescription>Latest updates from your schools</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.school}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="border-border bg-gradient-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Scheduled activities and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{event.title}</p>
                      <p className="text-sm text-muted-foreground">{event.participants}</p>
                    </div>
                    <span className="text-sm font-medium text-foreground">{event.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-border bg-gradient-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto flex-col gap-2 py-6">
                <School className="w-6 h-6 text-primary" />
                <span className="text-sm">Manage Schools</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-6">
                <Users className="w-6 h-6 text-secondary" />
                <span className="text-sm">Student Registry</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-6">
                <FileText className="w-6 h-6 text-accent" />
                <span className="text-sm">Create Exam</span>
              </Button>
              <Button variant="outline" className="h-auto flex-col gap-2 py-6">
                <Heart className="w-6 h-6 text-primary" />
                <span className="text-sm">Donations</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
