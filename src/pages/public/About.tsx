import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Target, Eye, Users, Award, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Karuna International</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Building compassionate global citizens through value-based education
          </p>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card className="shadow-medium">
              <CardHeader>
                <Eye className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To create a world where compassion, kindness, and respect for all living beings 
                  are fundamental values taught to every child. We envision a future where young 
                  minds grow into responsible global citizens committed to environmental conservation 
                  and ethical living.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <Target className="w-12 h-12 text-secondary mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  To awaken inherent love, kindness, and compassion in children and young adults 
                  towards all living beings through value-based education, cultural programs, and 
                  hands-on activities that promote environmental awareness and ethical behavior.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What We Do</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <Users className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Karuna Clubs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Establish and support compassion clubs in schools across India, engaging students 
                  in activities that promote kindness towards animals and environmental stewardship.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Value Education</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Develop and deliver comprehensive value education programs that integrate 
                  compassion, ethics, and environmental awareness into school curricula.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Community Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Organize workshops, seminars, and events that bring together educators, students, 
                  and community members to promote compassionate living and sustainability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Impact */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Impact</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Over 25 years of making a difference in communities across India
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-medium">
              <h3 className="text-4xl font-bold text-primary mb-2">2500+</h3>
              <p className="text-lg text-muted-foreground">Active Karuna Clubs</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-medium">
              <h3 className="text-4xl font-bold text-secondary mb-2">50000+</h3>
              <p className="text-lg text-muted-foreground">Students Reached</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-medium">
              <h3 className="text-4xl font-bold text-accent mb-2">1000+</h3>
              <p className="text-lg text-muted-foreground">Activities Conducted</p>
            </div>
            <div className="text-center p-6 bg-gradient-card rounded-lg shadow-medium">
              <h3 className="text-4xl font-bold text-primary mb-2">28</h3>
              <p className="text-lg text-muted-foreground">States Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <Heart className="w-8 h-8 text-primary inline-block mr-3" />
                <CardTitle className="inline-block">Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in fostering deep empathy and care for all living beings, teaching children 
                  to extend kindness beyond their immediate circle.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-8 h-8 text-secondary inline-block mr-3" />
                <CardTitle className="inline-block">Integrity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We uphold the highest standards of honesty and ethical behavior in all our programs 
                  and interactions with students, schools, and communities.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="w-8 h-8 text-accent inline-block mr-3" />
                <CardTitle className="inline-block">Sustainability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We promote environmental consciousness and sustainable practices that ensure a 
                  healthier planet for future generations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-accent text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Join Our Movement</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Be part of building a more compassionate world. Whether as a school, volunteer, or supporter, 
            your contribution makes a difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/demo">School Portal</Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
