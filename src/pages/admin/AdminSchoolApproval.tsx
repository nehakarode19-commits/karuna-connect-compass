import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Search, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface School {
  id: string;
  kc_no: string;
  school_name: string;
  principal_name: string;
  contact_number: string;
  email: string;
  kendra_name: string;
  status: string;
  created_at: string;
  rejection_reason?: string;
}

export default function AdminSchoolApproval() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    filterSchools();
  }, [schools, searchTerm, activeTab]);

  const fetchSchools = async () => {
    const { data, error } = await supabase
      .from("schools")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch schools",
        variant: "destructive",
      });
      return;
    }

    setSchools(data || []);
  };

  const filterSchools = () => {
    let filtered = schools.filter((school) => school.status === activeTab);

    if (searchTerm) {
      filtered = filtered.filter(
        (school) =>
          school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.kc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSchools(filtered);
  };

  const handleApprove = async (schoolId: string) => {
    setLoading(true);
    const { error } = await supabase
      .from("schools")
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
      })
      .eq("id", schoolId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve school",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "School approved successfully",
      });
      fetchSchools();
    }
    setLoading(false);
  };

  const handleReject = async () => {
    if (!selectedSchool || !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Please provide a rejection reason",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from("schools")
      .update({
        status: 'rejected',
        rejection_reason: rejectionReason,
      })
      .eq("id", selectedSchool.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject school",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "School registration rejected",
      });
      fetchSchools();
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedSchool(null);
    }
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const stats = {
    pending: schools.filter(s => s.status === 'pending').length,
    approved: schools.filter(s => s.status === 'approved').length,
    rejected: schools.filter(s => s.status === 'rejected').length,
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">School Approvals</h1>
          <p className="text-muted-foreground">Review and approve school registrations</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <h3 className="text-2xl font-bold">{stats.pending}</h3>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved</p>
                <h3 className="text-2xl font-bold">{stats.approved}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                <h3 className="text-2xl font-bold">{stats.rejected}</h3>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by school name, KC No, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 border-b">
              {(['pending', 'approved', 'rejected'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab} ({stats[tab]})
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredSchools.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No {activeTab} schools found
                </p>
              ) : (
                filteredSchools.map((school) => (
                  <Card key={school.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{school.school_name}</h3>
                          <Badge className={getStatusColor(school.status)}>
                            {school.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">KC No:</span>{" "}
                            {school.kc_no}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Principal:</span>{" "}
                            {school.principal_name}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Contact:</span>{" "}
                            {school.contact_number}
                          </div>
                          <div>
                            <span className="text-muted-foreground">Email:</span>{" "}
                            {school.email}
                          </div>
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Kendra:</span>{" "}
                            {school.kendra_name}
                          </div>
                          {school.rejection_reason && (
                            <div className="col-span-2 text-red-600">
                              <span className="font-medium">Rejection Reason:</span>{" "}
                              {school.rejection_reason}
                            </div>
                          )}
                        </div>
                      </div>
                      {activeTab === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(school.id)}
                            disabled={loading}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedSchool(school);
                              setShowRejectDialog(true);
                            }}
                            disabled={loading}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Card>
      </div>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject School Registration</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedSchool?.school_name}
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Enter rejection reason..."
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason("");
                setSelectedSchool(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={loading}>
              Reject School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
