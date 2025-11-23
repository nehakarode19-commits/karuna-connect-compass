import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Download, Heart, TrendingUp, Repeat, IndianRupee, Mail, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Donation {
  id: string;
  amount: number;
  donation_type: string;
  payment_method: string;
  status: string;
  receipt_sent: boolean;
  donation_date: string;
  is_recurring: boolean;
  donors?: {
    name: string;
    email: string;
  };
}

const AdminDonations = () => {
  const { toast } = useToast();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    donor_name: "",
    donor_email: "",
    amount: "",
    donation_type: "general",
    payment_method: "cash",
  });

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          donors (
            name,
            email
          )
        `)
        .order("donation_date", { ascending: false });

      if (error) throw error;
      setDonations(data || []);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // First create donor
      const { data: donorData, error: donorError } = await supabase
        .from("donors")
        .insert({
          name: formData.donor_name,
          email: formData.donor_email,
        })
        .select()
        .single();

      if (donorError) throw donorError;

      // Then create donation
      const { error: donationError } = await supabase
        .from("donations")
        .insert({
          donor_id: donorData.id,
          amount: parseFloat(formData.amount),
          donation_type: formData.donation_type,
          payment_method: formData.payment_method,
          status: "completed",
          receipt_sent: false,
        });

      if (donationError) throw donationError;

      toast({
        title: "Success",
        description: "Donation recorded successfully",
      });

      setDialogOpen(false);
      setFormData({
        donor_name: "",
        donor_email: "",
        amount: "",
        donation_type: "general",
        payment_method: "cash",
      });
      fetchDonations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredDonations = donations.filter((donation) => {
    const donorName = donation.donors?.name || "";
    const donorEmail = donation.donors?.email || "";
    const matchesSearch = 
      donorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donorEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "online") return matchesSearch && (donation.payment_method === "upi" || donation.payment_method === "card");
    if (activeTab === "offline") return matchesSearch && donation.payment_method === "cash";
    if (activeTab === "recurring") return matchesSearch && donation.is_recurring;
    return matchesSearch;
  });

  const totalAmount = donations.reduce((sum, d) => d.status === "completed" ? sum + d.amount : sum, 0);
  const onlineAmount = donations.filter(d => (d.payment_method === "upi" || d.payment_method === "card") && d.status === "completed").reduce((sum, d) => sum + d.amount, 0);
  const offlineAmount = donations.filter(d => d.payment_method === "cash" && d.status === "completed").reduce((sum, d) => sum + d.amount, 0);
  const recurringCount = donations.filter(d => d.is_recurring).length;

  const stats = [
    { 
      label: "Total Donations", 
      value: `₹${(totalAmount / 100000).toFixed(2)}L`, 
      icon: Heart,
      color: "text-red-600 bg-red-500/10" 
    },
    { 
      label: "Online Donations", 
      value: `₹${(onlineAmount / 100000).toFixed(2)}L`, 
      icon: TrendingUp,
      color: "text-green-600 bg-green-500/10" 
    },
    { 
      label: "Offline Donations", 
      value: `₹${(offlineAmount / 100000).toFixed(2)}L`, 
      icon: IndianRupee,
      color: "text-blue-600 bg-blue-500/10" 
    },
    { 
      label: "Recurring Donors", 
      value: recurringCount.toString(), 
      icon: Repeat,
      color: "text-purple-600 bg-purple-500/10" 
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Donation Management</h1>
            <p className="text-muted-foreground mt-1">
              Track and manage all donations with automated receipts
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-hero border-0">
                <Plus className="w-4 h-4" />
                Record Donation
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Offline Donation</DialogTitle>
                <DialogDescription>Enter donation details to record manually</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Donor Name *</Label>
                  <Input value={formData.donor_name} onChange={(e) => setFormData({...formData, donor_name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Donor Email *</Label>
                  <Input type="email" value={formData.donor_email} onChange={(e) => setFormData({...formData, donor_email: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Amount (₹) *</Label>
                  <Input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label>Donation Type</Label>
                  <Select value={formData.donation_type} onValueChange={(v) => setFormData({...formData, donation_type: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="health">Health</SelectItem>
                      <SelectItem value="infrastructure">Infrastructure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select value={formData.payment_method} onValueChange={(v) => setFormData({...formData, payment_method: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Record Donation</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[0]}`} />
                  </div>
                </div>
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
                  placeholder="Search by donor name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export Report
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="border-b px-6">
                <TabsList className="bg-transparent border-0 h-auto p-0">
                  <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    All Donations
                  </TabsTrigger>
                  <TabsTrigger value="online" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Online
                  </TabsTrigger>
                  <TabsTrigger value="offline" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Offline
                  </TabsTrigger>
                  <TabsTrigger value="recurring" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
                    Recurring
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab} className="m-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/20">
                      <tr>
                        <th className="text-left p-4 font-semibold text-sm">Donor Name</th>
                        <th className="text-left p-4 font-semibold text-sm">Contact</th>
                        <th className="text-left p-4 font-semibold text-sm">Amount</th>
                        <th className="text-left p-4 font-semibold text-sm">Type</th>
                        <th className="text-left p-4 font-semibold text-sm">Frequency</th>
                        <th className="text-left p-4 font-semibold text-sm">Status</th>
                        <th className="text-left p-4 font-semibold text-sm">Date</th>
                        <th className="text-left p-4 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">Loading donations...</td>
                        </tr>
                      ) : filteredDonations.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-muted-foreground">No donations found</td>
                        </tr>
                      ) : (
                        filteredDonations.map((donation) => (
                          <tr key={donation.id} className="border-b hover:bg-muted/30 transition-colors">
                            <td className="p-4">
                              <div className="font-medium">{donation.donors?.name || "N/A"}</div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                <span className="text-xs">{donation.donors?.email || "N/A"}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="font-semibold">₹{donation.amount.toLocaleString('en-IN')}</div>
                            </td>
                            <td className="p-4">
                              <Badge variant={donation.payment_method === "cash" ? "secondary" : "default"}>
                                {donation.payment_method}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant="outline" className={donation.is_recurring ? "border-purple-500 text-purple-600" : ""}>
                                {donation.is_recurring ? "recurring" : "one-time"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge variant={
                                donation.status === "completed" ? "default" : 
                                donation.status === "pending" ? "secondary" : 
                                "destructive"
                              }>
                                {donation.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-muted-foreground">
                                {new Date(donation.donation_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </td>
                            <td className="p-4">
                              {donation.receipt_sent ? (
                                <Badge variant="outline" className="gap-1 text-green-600 border-green-600">
                                  <CheckCircle className="w-3 h-3" />
                                  Sent
                                </Badge>
                              ) : (
                                <Button size="sm" variant="outline">Send Receipt</Button>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDonations;
