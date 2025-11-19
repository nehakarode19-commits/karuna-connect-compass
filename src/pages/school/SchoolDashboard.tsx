import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Plus } from "lucide-react";
import { SchoolLayout } from "./SchoolLayout";
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
    <SchoolLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            Welcome Back!
          </h1>
          <p className="text-muted-foreground mt-1">
            View your activities and manage your school profile
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Active Activities</h3>
              <p className="text-3xl font-bold text-primary">{events.length}</p>
            </CardContent>
          </Card>
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">My Submissions</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </CardContent>
          </Card>
          <Card className="shadow-medium border-border/50">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Pending Review</h3>
              <p className="text-3xl font-bold text-primary">0</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-medium border-border/50">
          <CardContent className="p-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Assigned Activities</h2>
              <p className="text-muted-foreground">
                View and submit reports for your assigned Karuna activities • {events.length} events this year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">Loading activities...</p>
                </div>
              ) : events.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No activities available</p>
                </div>
              ) : (
                events.map((event) => (
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
                        className="w-full gap-2 bg-gradient-to-r from-primary to-primary/80"
                        onClick={() => navigate(`/school/submit/${event.id}`)}
                      >
                        <Plus className="w-4 h-4" />
                        Submit Report
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
};

export default SchoolDashboard;
