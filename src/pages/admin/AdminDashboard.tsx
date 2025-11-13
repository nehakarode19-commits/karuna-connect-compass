import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { School, Users, Calendar, Heart, TrendingUp, Award, FileText, CheckCircle } from "lucide-react";

const AdminDashboard = () => {
  const stats = [
    { title: "Total Schools", value: "2,567", change: "+12%", icon: School, color: "text-blue-600", bgColor: "bg-blue-500/10" },
    { title: "Total Students", value: "12,450", change: "+8%", icon: Users, color: "text-green-600", bgColor: "bg-green-500/10" },
    { title: "Active Events", value: "24", change: "6 new", icon: Calendar, color: "text-purple-600", bgColor: "bg-purple-500/10" },
    { title: "Total Donations", value: "₹5.2L", change: "+15%", icon: Heart, color: "text-red-600", bgColor: "bg-red-500/10" },
  ];

  const recentSubmissions = [
    { school: "St. Xavier's High School", event: "Independence Day", status: "pending", date: "2 hours ago" },
    { school: "Delhi Public School", event: "Tree Plantation", status: "approved", date: "5 hours ago" },
    { school: "Bishops School", event: "Essay Competition", status: "pending", date: "1 day ago" },
    { school: "Campion School", event: "Sports Meet", status: "approved", date: "1 day ago" },
  ];

  const upcomingEvents = [
    { name: "Stories of Compassion - Essay", date: "Sep 1-15, 2024", schools: 245, chapter: "National" },
    { name: "Inter-School Sports Meet", date: "Oct 5-7, 2024", schools: 89, chapter: "Pune" },
    { name: "Community Service Day", date: "Nov 10, 2024", schools: 312, chapter: "All Chapters" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here's what's happening with Karuna International
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Academic Year 2024-25
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Recent Submissions</CardTitle>
              <Badge variant="outline">{recentSubmissions.length} pending</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentSubmissions.map((submission, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{submission.school}</p>
                      <p className="text-xs text-muted-foreground">{submission.event}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={submission.status === "approved" ? "default" : "secondary"} className="text-xs">
                        {submission.status === "approved" ? (
                          <><CheckCircle className="w-3 h-3 mr-1" />Approved</>
                        ) : (
                          "Pending"
                        )}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{submission.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
              <Badge variant="outline">{upcomingEvents.length} scheduled</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex-1">
                      <p className="font-medium text-sm mb-1">{event.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {event.schools} schools
                      </Badge>
                      <p className="text-xs text-muted-foreground">{event.chapter}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-hero text-primary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8" />
                <Badge className="bg-background/20 text-primary-foreground border-0">+12%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">89%</div>
              <div className="text-sm opacity-90">Submission Rate</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Award className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">Top 10%</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">245</div>
              <div className="text-sm opacity-90">Certificates Issued</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-8 h-8" />
                <Badge className="bg-white/20 text-white border-0">This Month</Badge>
              </div>
              <div className="text-2xl font-bold mb-1">1,245</div>
              <div className="text-sm opacity-90">Reports Generated</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
