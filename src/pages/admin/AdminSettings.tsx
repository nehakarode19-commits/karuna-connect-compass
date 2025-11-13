import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Settings, Users, MessageSquare, Shield } from "lucide-react";

const AdminSettings = () => {
  const adminUsers = [
    { id: "1", name: "Rajesh Kumar", email: "rajesh@karuna.org", role: "Super Admin", status: "active" },
    { id: "2", name: "Priya Sharma", email: "priya@karuna.org", role: "Program Manager", status: "active" },
    { id: "3", name: "Amit Patel", email: "amit@karuna.org", role: "Reviewer", status: "active" },
    { id: "4", name: "Neha Desai", email: "neha@karuna.org", role: "Finance", status: "active" }
  ];

  const roles = [
    { name: "Super Admin", description: "Full access to all features", users: 1 },
    { name: "Program Manager", description: "Manage events and school assignments", users: 2 },
    { name: "Reviewer", description: "Review and approve submissions", users: 3 },
    { name: "Finance", description: "Access to donation reports", users: 1 }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage system configuration, users, and permissions
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" />
              Users & Roles
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2">
              <Settings className="w-4 h-4" />
              General
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-2">
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
                  <CardTitle>Admin Users</CardTitle>
                  <Button className="gap-2 bg-gradient-hero border-0" size="sm">
                    <Plus className="w-4 h-4" />
                    Add User
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y">
                    {adminUsers.map((user) => (
                      <div key={user.id} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-semibold">
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary">{user.role}</Badge>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardHeader className="border-b bg-muted/20">
                  <CardTitle>Roles & Permissions</CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  {roles.map((role, index) => (
                    <div key={index} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-semibold flex items-center gap-2">
                            <Shield className="w-4 h-4 text-primary" />
                            {role.name}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {role.description}
                          </div>
                        </div>
                        <Badge variant="outline" className="shrink-0">{role.users} users</Badge>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full gap-2" size="sm">
                    <Plus className="w-4 h-4" />
                    Add Role
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle>WhatsApp Notifications</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">OTP Messages</div>
                      <div className="text-sm text-muted-foreground">Send OTP for login authentication</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">Submission Acknowledgement</div>
                      <div className="text-sm text-muted-foreground">Notify schools when report is received</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">Exam Reminders</div>
                      <div className="text-sm text-muted-foreground">Send exam schedule reminders to students</div>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border">
                    <div>
                      <div className="font-medium">Donation Receipts</div>
                      <div className="text-sm text-muted-foreground">Send automated donation receipts</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle>Email Templates</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label>OTP Email Template</Label>
                  <Textarea 
                    placeholder="Enter OTP email template..." 
                    rows={4}
                    defaultValue="Your OTP for login is {OTP}. Valid for 10 minutes."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Receipt Email Template</Label>
                  <Textarea 
                    placeholder="Enter receipt email template..." 
                    rows={4}
                    defaultValue="Thank you for your donation of ₹{AMOUNT}. Your receipt is attached."
                  />
                </div>

                <Button className="bg-gradient-hero border-0">Save Templates</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="general" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle>Organization Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Organization Name</Label>
                    <Input defaultValue="Karuna International" />
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Email</Label>
                    <Input defaultValue="contact@karuna.org" />
                  </div>

                  <div className="space-y-2">
                    <Label>Contact Phone</Label>
                    <Input defaultValue="+91 98765 43210" />
                  </div>

                  <div className="space-y-2">
                    <Label>Academic Year</Label>
                    <Input defaultValue="2024-25" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea 
                    placeholder="Enter organization address..." 
                    rows={3}
                    defaultValue="Karuna International Headquarters, Mumbai, India"
                  />
                </div>

                <Button className="bg-gradient-hero border-0">Save Changes</Button>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader className="border-b bg-muted/20">
                <CardTitle>Platform Configuration</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">School Registrations</div>
                    <div className="text-sm text-muted-foreground">Allow new schools to register</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Student Registrations</div>
                    <div className="text-sm text-muted-foreground">Allow schools to register students</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Activity Submissions</div>
                    <div className="text-sm text-muted-foreground">Allow schools to submit activity reports</div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <div className="font-medium">Maintenance Mode</div>
                    <div className="text-sm text-muted-foreground">Put platform in maintenance mode</div>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
