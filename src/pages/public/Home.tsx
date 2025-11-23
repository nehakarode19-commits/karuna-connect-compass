import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, TrendingUp, Award, BookOpen, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/ki-logo.png";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[700px] bg-gradient-hero flex items-center justify-center text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/30" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span>Transforming Lives Through Compassion</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Building A World of
              <span className="block bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
                Kindness & Care
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Awakening compassion in young hearts. Empowering 2,500+ schools across India to create a better tomorrow.
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center items-center">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg group" asChild>
                <Link to="/demo">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm" asChild>
                <Link to="/programs">Explore Programs</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6 -mt-32 relative z-20">
            <Card className="shadow-strong hover:shadow-natural transition-shadow">
              <CardHeader>
                <Heart className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Donation</CardTitle>
                <CardDescription>Donate for a better world</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link to="/contact">Donate Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-strong hover:shadow-natural transition-shadow">
              <CardHeader>
                <Users className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Volunteer</CardTitle>
                <CardDescription>Join the Karuna Movement</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="secondary" className="w-full" asChild>
                  <Link to="/contact">Join Now</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-strong hover:shadow-natural transition-shadow">
              <CardHeader>
                <TrendingUp className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Fundraise</CardTitle>
                <CardDescription>Help us raise funds</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/about">Read More</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">About Us</h2>
            <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Become a part of a better world
            </p>
          </div>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-foreground/80 leading-relaxed">
              Karuna International is a registered nonprofit service organization dedicated to awakening love, kindness, 
              and compassion in children and young adults towards all living beings. We inspire appreciation for the 
              environment and encourage conservation efforts in alignment with constitutional values.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Our Mission</h2>
            <p className="text-xl text-primary">Transform youngsters into global citizens</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="shadow-medium">
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mb-4" />
                <CardTitle>Moral Values</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Value education for children</li>
                  <li>• Compassion stories from epics</li>
                  <li>• Animal welfare in curriculum</li>
                  <li>• Violence-free science education</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <Heart className="w-12 h-12 text-secondary mb-4" />
                <CardTitle>Kindness & Compassion</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Compassion to animals</li>
                  <li>• Preventing cruelty</li>
                  <li>• Compassionate living</li>
                  <li>• Beauty without cruelty</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-medium">
              <CardHeader>
                <Globe className="w-12 h-12 text-accent mb-4" />
                <CardTitle>Animal Welfare</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Environmental conservation</li>
                  <li>• Wildlife protection</li>
                  <li>• Ethical treatment of animals</li>
                  <li>• Sustainable practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-accent text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Award className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">2500+</h3>
              <p className="text-lg">Schools</p>
            </div>
            <div>
              <Users className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">50000+</h3>
              <p className="text-lg">Students</p>
            </div>
            <div>
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">1000+</h3>
              <p className="text-lg">Activities</p>
            </div>
            <div>
              <Heart className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">25+</h3>
              <p className="text-lg">Years</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 text-foreground">Ready to Make a Difference?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join our community of compassionate educators and help build a better world for future generations.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/demo">School Portal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
