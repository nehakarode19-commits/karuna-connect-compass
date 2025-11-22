import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We'd love to hear from you. Reach out to learn more about our programs or get involved.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto -mt-16 relative z-10">
            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <Mail className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <a href="mailto:info@karunainternational.org" className="text-sm text-primary hover:underline">
                  info@karunainternational.org
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <Phone className="w-10 h-10 text-secondary mx-auto mb-2" />
                <CardTitle>Phone</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <a href="tel:+911234567890" className="text-sm text-primary hover:underline">
                  +91 123 456 7890
                </a>
              </CardContent>
            </Card>

            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <MapPin className="w-10 h-10 text-accent mx-auto mb-2" />
                <CardTitle>Address</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Mumbai, India
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-strong">
              <CardHeader className="text-center">
                <Clock className="w-10 h-10 text-primary mx-auto mb-2" />
                <CardTitle>Hours</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Mon-Fri: 9AM-6PM
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Send Us a Message</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
              <p className="text-xl text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>
            <Card className="shadow-strong">
              <CardHeader>
                <CardTitle>Contact Form</CardTitle>
                <CardDescription>We typically respond within 24-48 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 1234567890"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                        placeholder="Program Inquiry"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      placeholder="Tell us how we can help..."
                      rows={6}
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full md:w-auto">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Map Section - Placeholder */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted/30 rounded-lg p-12 text-center">
              <MapPin className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Visit Our Office</h3>
              <p className="text-muted-foreground mb-6">
                Schedule an appointment to visit our headquarters and learn more about our work
              </p>
              <Button variant="outline">Get Directions</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
