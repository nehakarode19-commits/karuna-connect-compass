import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Plus, Search } from "lucide-react";
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
  status: string;
}

const PROGRAM_CATEGORIES = [
  { id: "A", name: "Intra School Programmes", color: "bg-blue-500" },
  { id: "B", name: "Inter School Programmes", color: "bg-green-500" },
  { id: "C", name: "Inter-School Competitions", color: "bg-purple-500" },
  { id: "D", name: "Public Relation Programmes", color: "bg-orange-500" },
  { id: "E", name: "Club Internal/External Growth", color: "bg-pink-500" },
  { id: "F", name: "National Level Programme", color: "bg-red-500" },
];

const SchoolActivities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [school, setSchool] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchSchoolAndEvents();
  }, []);

  const fetchSchoolAndEvents = async () => {
    try {
      // First get the logged-in school
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (schoolError) throw schoolError;
      setSchool(schoolData);

      // Get assigned activities for this school or chapter
      const { data: assignments, error: assignError } = await supabase
        .from("event_assignments")
        .select("event_id, deadline")
        .or(`school_id.eq.${schoolData.id},chapter_id.eq.${schoolData.chapter_id}`);

      if (assignError) throw assignError;

      const assignedEventIds = assignments?.map(a => a.event_id) || [];
      
      if (assignedEventIds.length === 0) {
        setEvents([]);
        return;
      }

      // Fetch only assigned events
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .in("id", assignedEventIds)
        .eq("status", "active")
        .order("start_date", { ascending: true });

      if (error) throw error;
      
      // Add deadline info to events
      const eventsWithDeadlines = data.map(event => ({
        ...event,
        deadline: assignments?.find(a => a.event_id === event.id)?.deadline
      }));
      
      setEvents(eventsWithDeadlines);
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

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SchoolLayout>
      <div className="space-y-6 p-4 md:p-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Activity Categories
          </h1>
          <p className="text-muted-foreground mt-1">
            Choose a category and submit your highlights
          </p>
        </div>

        {/* Category Cards - Mobile First */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PROGRAM_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="overflow-hidden hover:shadow-medium transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => setSelectedCategory(category.id)}
            >
              <div className={`h-2 ${category.color}`} />
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="text-lg font-bold">
                    {category.id}
                  </Badge>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click to view and submit reports
                </p>
                <Button 
                  className="w-full gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/school/activities");
                  }}
                >
                  <Plus className="w-4 h-4" />
                  Add Highlights
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="shadow-medium border-border/50">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search activities..."
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading activities...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No activities found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden hover:shadow-medium transition-all duration-200 border-border/50 hover:border-primary/20 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.thumbnail_url || "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400&h=300&fit=crop"}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="default" className="bg-background/90 backdrop-blur-sm">
                      {event.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {event.location}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => navigate(`/school/activity/${event.id}`)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => navigate(`/school/submit/${event.id}`)}
                      size="sm"
                      className="flex-1 gap-2 bg-gradient-to-r from-primary to-primary/80"
                    >
                      <Plus className="w-4 h-4" />
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </SchoolLayout>
  );
};

export default SchoolActivities;
