import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, MapPin, Plus, LogOut, User } from "lucide-react";
import { SchoolProfileForm } from "@/components/school/SchoolProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  thumbnail_url: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Independence Day Celebration",
    description: "Organize a flag hoisting ceremony and cultural program celebrating India's Independence Day with patriotic songs and speeches.",
    location: "School Campus",
    start_date: "2024-08-15",
    end_date: "2024-08-15",
    thumbnail_url: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&h=300&fit=crop"
  },
  {
    id: "2",
    title: "Tree Plantation Drive",
    description: "Students will plant 100+ saplings in the school premises and nearby community areas to promote environmental awareness.",
    location: "School & Community",
    start_date: "2024-07-20",
    end_date: "2024-07-22",
    thumbnail_url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=500&h=300&fit=crop"
  },
  {
    id: "3",
    title: "Stories of Compassion - Essay Competition",
    description: "Students write inspiring stories showcasing acts of kindness and compassion in their communities.",
    location: "Online Submission",
    start_date: "2024-09-01",
    end_date: "2024-09-15",
    thumbnail_url: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=500&h=300&fit=crop"
  },
  {
    id: "4",
    title: "Inter-School Sports Meet",
    description: "Annual sports competition featuring athletics, cricket, and football matches between Karuna Clubs.",
    location: "District Stadium",
    start_date: "2024-10-05",
    end_date: "2024-10-07",
    thumbnail_url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop"
  },
  {
    id: "5",
    title: "Community Service Day",
    description: "Students visit old age homes and orphanages to spend time with residents and contribute essential supplies.",
    location: "Various Locations",
    start_date: "2024-11-10",
    end_date: "2024-11-10",
    thumbnail_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop"
  },
  {
    id: "6",
    title: "World Peace Day Assembly",
    description: "Special assembly program focusing on the importance of peace, harmony, and non-violence with skits and presentations.",
    location: "School Auditorium",
    start_date: "2024-09-21",
    end_date: "2024-09-21",
    thumbnail_url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500&h=300&fit=crop"
  }
];

const SchoolDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("status", "active")
        .order("start_date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
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

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">St. Xavier's High School</h1>
            <p className="text-sm text-muted-foreground">KC No: AHM-001 • Ahmedabad Chapter</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="activities" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="activities">Activities</TabsTrigger>
            <TabsTrigger value="profile">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
          </TabsList>

          <TabsContent value="activities" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Assigned Activities</h2>
              <p className="text-muted-foreground">
                View and submit reports for your assigned Karuna activities • {events.length} events this year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  {event.thumbnail_url && (
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={event.thumbnail_url}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{event.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{new Date(event.start_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    <Button 
                      className="w-full gap-2 bg-gradient-hero border-0"
                      onClick={() => navigate(`/school/submit/${event.id}`)}
                    >
                      <Plus className="w-4 h-4" />
                      Submit Report
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <SchoolProfileForm />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default SchoolDashboard;
