import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Award, Heart, Target, Globe, Sparkles, TreePine } from "lucide-react";
import { Link } from "react-router-dom";

const Programs = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Our Programs</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Comprehensive value-based education initiatives designed to nurture compassionate global citizens
          </p>
        </div>
      </section>

      {/* Main Programs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Core Programs</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Karuna Clubs</CardTitle>
                <CardDescription>School-based compassion initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Establish student-led clubs focused on promoting kindness, compassion, and ethical 
                  behavior. Activities include awareness campaigns, community service, and animal welfare projects.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Weekly compassion activities</li>
                  <li>• Student leadership development</li>
                  <li>• Community engagement projects</li>
                  <li>• Annual awards and recognition</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-4" />
                <CardTitle className="text-2xl">Value Education</CardTitle>
                <CardDescription>Curriculum integration programs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Comprehensive value education modules designed to integrate compassion, ethics, and 
                  environmental awareness into existing school curricula across all grade levels.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Age-appropriate lesson plans</li>
                  <li>• Teacher training workshops</li>
                  <li>• Interactive learning materials</li>
                  <li>• Assessment and evaluation tools</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <TreePine className="w-12 h-12 text-accent mb-4" />
                <CardTitle className="text-2xl">Environmental Conservation</CardTitle>
                <CardDescription>Eco-awareness initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Programs focused on environmental stewardship, wildlife conservation, and sustainable 
                  living practices to instill a sense of responsibility towards our planet.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Tree plantation drives</li>
                  <li>• Wildlife protection awareness</li>
                  <li>• Waste management projects</li>
                  <li>• Sustainable living workshops</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium hover:shadow-strong transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Animal Welfare</CardTitle>
                <CardDescription>Compassion for all beings</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Educational programs promoting kindness and ethical treatment of animals, including 
                  workshops on preventing cruelty and fostering empathy towards all living creatures.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Animal welfare workshops</li>
                  <li>• Cruelty prevention campaigns</li>
                  <li>• Pet care education</li>
                  <li>• Veterinary care support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Activity Types */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Activity Categories</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Diverse activities designed to engage students at all levels
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card>
              <CardHeader>
                <Target className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Intra School Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Within-school competitions, events, and programs that foster compassion among students.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-secondary mb-3" />
                <CardTitle>Inter School Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Collaborative activities bringing together multiple schools for larger impact initiatives.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="w-10 h-10 text-accent mb-3" />
                <CardTitle>National Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Large-scale campaigns and events celebrating compassion at a national level.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Community Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Programs extending beyond schools to impact wider communities and society.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="w-10 h-10 text-secondary mb-3" />
                <CardTitle>Workshops & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Professional development for educators and capacity building for student leaders.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-accent mb-3" />
                <CardTitle>Public Relations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Media engagement and awareness campaigns promoting our mission and values.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Program Impact</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-primary mb-2">500+</h3>
              <p className="text-muted-foreground">Awards Distributed Annually</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-secondary mb-2">10000+</h3>
              <p className="text-muted-foreground">Trees Planted</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-card border-2 border-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold text-accent mb-2">1000+</h3>
              <p className="text-muted-foreground">Animals Helped</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Start Your Journey</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Register your school to participate in our life-changing programs and activities
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo">School Registration</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20" asChild>
              <Link to="/contact">Get Information</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;
