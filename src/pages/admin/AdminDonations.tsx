import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Download, Heart, TrendingUp, Repeat, IndianRupee, Mail, CheckCircle } from "lucide-react";

interface Donation {
  id: string;
  donor_name: string;
  email: string;
  amount: number;
  type: "online" | "offline";
  frequency: "one-time" | "recurring";
  status: "completed" | "pending" | "failed";
  receipt_sent: boolean;
  date: string;
}

const mockDonations: Donation[] = [
  {
    id: "1",
    donor_name: "Rajesh Kumar",
    email: "rajesh.k@email.com",
    amount: 25000,
    type: "online",
    frequency: "recurring",
    status: "completed",
    receipt_sent: true,
    date: "2024-01-15"
  },
  {
    id: "2",
    donor_name: "Priya Sharma",
    email: "priya.sharma@email.com",
    amount: 10000,
    type: "online",
    frequency: "one-time",
    status: "completed",
    receipt_sent: true,
    date: "2024-01-14"
  },
  {
    id: "3",
    donor_name: "Amit Patel",
    email: "amit.patel@email.com",
    amount: 50000,
    type: "offline",
    frequency: "one-time",
    status: "completed",
    receipt_sent: false,
    date: "2024-01-13"
  },
  {
    id: "4",
    donor_name: "Neha Desai",
    email: "neha.d@email.com",
    amount: 15000,
    type: "online",
    frequency: "recurring",
    status: "completed",
    receipt_sent: true,
    date: "2024-01-12"
  },
  {
    id: "5",
    donor_name: "Vikram Singh",
    email: "vikram.singh@email.com",
    amount: 5000,
    type: "online",
    frequency: "one-time",
    status: "pending",
    receipt_sent: false,
    date: "2024-01-11"
  },
  {
    id: "6",
    donor_name: "Anita Joshi",
    email: "anita.joshi@email.com",
    amount: 30000,
    type: "offline",
    frequency: "one-time",
    status: "completed",
    receipt_sent: true,
    date: "2024-01-10"
  }
];

const AdminDonations = () => {
  const [donations] = useState<Donation[]>(mockDonations);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredDonations = donations.filter((donation) => {
    const matchesSearch = 
      donation.donor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donation.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "online") return matchesSearch && donation.type === "online";
    if (activeTab === "offline") return matchesSearch && donation.type === "offline";
    if (activeTab === "recurring") return matchesSearch && donation.frequency === "recurring";
    return matchesSearch;
  });

  const totalAmount = donations.reduce((sum, d) => d.status === "completed" ? sum + d.amount : sum, 0);
  const onlineAmount = donations.filter(d => d.type === "online" && d.status === "completed").reduce((sum, d) => sum + d.amount, 0);
  const offlineAmount = donations.filter(d => d.type === "offline" && d.status === "completed").reduce((sum, d) => sum + d.amount, 0);
  const recurringCount = donations.filter(d => d.frequency === "recurring").length;

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
          <Button className="gap-2 bg-gradient-hero border-0">
            <Plus className="w-4 h-4" />
            Record Donation
          </Button>
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
                      {filteredDonations.map((donation) => (
                        <tr key={donation.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <div className="font-medium">{donation.donor_name}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-3 h-3" />
                              <span className="text-xs">{donation.email}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold">₹{donation.amount.toLocaleString('en-IN')}</div>
                          </td>
                          <td className="p-4">
                            <Badge variant={donation.type === "online" ? "default" : "secondary"}>
                              {donation.type}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge variant="outline" className={donation.frequency === "recurring" ? "border-purple-500 text-purple-600" : ""}>
                              {donation.frequency}
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
                              {new Date(donation.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                      ))}
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
