import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Calendar, MapPin, Eye, Users, Filter } from "lucide-react";

interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  start_date: string;
  end_date: string;
  location: string;
  assigned_schools: number;
  submissions: number;
  thumbnail: string;
  status: "upcoming" | "ongoing" | "completed";
}

const mockActivities: Activity[] = [
  {
    id: "1",
    title: "Independence Day Celebration",
    description: "Organize a flag hoisting ceremony and cultural program",
    category: "National",
    start_date: "2024-08-15",
    end_date: "2024-08-15",
    location: "All Schools",
    assigned_schools: 2567,
    submissions: 2340,
    thumbnail: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop",
    status: "completed"
  },
  {
    id: "2",
    title: "Tree Plantation Drive",
    description: "Students plant 100+ saplings to promote environmental awareness",
    category: "Environment",
    start_date: "2024-07-20",
    end_date: "2024-07-22",
    location: "Community",
    assigned_schools: 1850,
    submissions: 1620,
    thumbnail: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400&h=300&fit=crop",
    status: "completed"
  },
  {
    id: "3",
    title: "Stories of Compassion - Essay",
    description: "Students write inspiring stories showcasing acts of kindness",
    category: "Literature",
    start_date: "2024-09-01",
    end_date: "2024-09-15",
    location: "Online",
    assigned_schools: 2100,
    submissions: 856,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop",
    status: "ongoing"
  },
  {
    id: "4",
    title: "Inter-School Sports Meet",
    description: "Annual sports competition featuring athletics and team sports",
    category: "Sports",
    start_date: "2024-10-05",
    end_date: "2024-10-07",
    location: "District Stadiums",
    assigned_schools: 890,
    submissions: 0,
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
    status: "upcoming"
  },
  {
    id: "5",
    title: "Community Service Day",
    description: "Students visit old age homes and orphanages",
    category: "Social Service",
    start_date: "2024-11-10",
    end_date: "2024-11-10",
    location: "Various",
    assigned_schools: 1560,
    submissions: 0,
    thumbnail: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop",
    status: "upcoming"
  },
  {
    id: "6",
    title: "World Peace Day Assembly",
    description: "Special assembly focusing on peace, harmony, and non-violence",
    category: "National",
    start_date: "2024-09-21",
    end_date: "2024-09-21",
    location: "School Auditoriums",
    assigned_schools: 2400,
    submissions: 320,
    thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop",
    status: "ongoing"
  }
];

const AdminActivity = () => {
  const [activities] = useState<Activity[]>(mockActivities);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = 
      activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && activity.status === activeTab;
  });

  const stats = [
    { label: "Total Activities", value: activities.length, color: "text-blue-600 bg-blue-500/10" },
    { label: "Ongoing", value: activities.filter(a => a.status === "ongoing").length, color: "text-green-600 bg-green-500/10" },
    { label: "Upcoming", value: activities.filter(a => a.status === "upcoming").length, color: "text-orange-600 bg-orange-500/10" },
    { label: "Total Submissions", value: activities.reduce((sum, a) => sum + a.submissions, 0), color: "text-purple-600 bg-purple-500/10" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Activity Management</h1>
            <p className="text-muted-foreground mt-1">
              Create, assign, and manage Karuna activities across all schools
            </p>
          </div>
          <Button className="gap-2 bg-gradient-hero border-0">
            <Plus className="w-4 h-4" />
            Create Activity
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className={`text-3xl font-bold mb-1 ${stat.color.split(' ')[0]}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2">
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search activities by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6">
                <TabsList className="bg-transparent border-0 h-auto p-0">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    All Activities
                  </TabsTrigger>
                  <TabsTrigger value="ongoing" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Ongoing
                  </TabsTrigger>
                  <TabsTrigger value="upcoming" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Upcoming
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Completed
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0 p-6">
                {filteredActivities.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    No activities found
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((activity) => (
                      <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-all group">
                        <div className="aspect-video w-full overflow-hidden bg-muted">
                          <img
                            src={activity.thumbnail}
                            alt={activity.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-5 space-y-4">
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                                {activity.title}
                              </h3>
                              <Badge 
                                variant={activity.status === "ongoing" ? "default" : activity.status === "upcoming" ? "secondary" : "outline"}
                                className="shrink-0"
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {activity.description}
                            </p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span>{new Date(activity.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4 shrink-0" />
                              <span className="line-clamp-1">{activity.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Users className="w-4 h-4 shrink-0" />
                              <span>{activity.assigned_schools} schools assigned</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t flex justify-between items-center">
                            <div>
                              <div className="text-sm font-semibold">{activity.submissions} / {activity.assigned_schools}</div>
                              <div className="text-xs text-muted-foreground">Submissions</div>
                            </div>
                            <Button size="sm" variant="outline" className="gap-2">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminActivity;
