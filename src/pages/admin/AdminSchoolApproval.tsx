import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, Clock, Search, Plus, X } from "lucide-react";
import { z } from "zod";
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

const schoolFormSchema = z.object({
  kcNo: z.string().trim().max(50).optional(),
  schoolName: z.string().trim().min(2, "School name is required").max(200),
  kendraName: z.string().trim().min(2, "Kendra name is required").max(200),
  principalName: z.string().trim().min(2, "Principal name is required").max(100),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),
  schoolEmail: z.string().email("Invalid email address").max(255),
  teacherName: z.string().trim().min(2, "Teacher name is required").max(100),
  teacherMobile: z.string().regex(/^[0-9]{10}$/, "Mobile number must be 10 digits"),
  teacherEmail: z.string().email("Invalid email address").max(255),
});

export default function AdminSchoolApproval() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  // Add School Form State
  const [formData, setFormData] = useState({
    kcNo: "",
    schoolName: "",
    kendraName: "",
    principalName: "",
    contactNumber: "",
    schoolEmail: "",
    teacherName: "",
    teacherMobile: "",
    teacherEmail: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

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

  const handleAddSchool = async () => {
    // Validate form
    try {
      schoolFormSchema.parse(formData);
      setFormErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
        return;
      }
    }

    setLoading(true);
    try {
      // Get the current user (admin)
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to add schools",
          variant: "destructive",
        });
        return;
      }

      // Create a temporary user_id (in production, school would sign up themselves)
      // For now, we'll use the admin's user_id as a placeholder
      const { data: schoolData, error: schoolError } = await supabase
        .from("schools")
        .insert({
          kc_no: formData.kcNo || `KC${Date.now()}`,
          school_name: formData.schoolName,
          principal_name: formData.principalName,
          contact_number: formData.contactNumber,
          email: formData.schoolEmail,
          kendra_name: formData.kendraName,
          status: 'approved',
          approved_at: new Date().toISOString(),
          user_id: user.id, // Placeholder - in production this would be the school's own user_id
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Add teacher record
      const { error: teacherError } = await supabase
        .from("teachers")
        .insert({
          school_id: schoolData.id,
          name: formData.teacherName,
          mobile: formData.teacherMobile,
          email: formData.teacherEmail,
          academic_year: new Date().getFullYear().toString(),
          is_current: true,
        });

      if (teacherError) throw teacherError;

      toast({
        title: "Success",
        description: "School added successfully",
      });
      
      // Reset form and close
      setFormData({
        kcNo: "",
        schoolName: "",
        kendraName: "",
        principalName: "",
        contactNumber: "",
        schoolEmail: "",
        teacherName: "",
        teacherMobile: "",
        teacherEmail: "",
      });
      setShowAddSchoolForm(false);
      fetchSchools();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add school",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">School Approvals</h1>
            <p className="text-muted-foreground">Review and approve school registrations</p>
          </div>
          <Button onClick={() => setShowAddSchoolForm(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add School
          </Button>
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

      {/* Add School Form Dialog */}
      <Dialog open={showAddSchoolForm} onOpenChange={setShowAddSchoolForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add School</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* School and Contact Details Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">School and Contact Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="kcNo">
                    KC No <span className="text-xs text-muted-foreground">(call KC Hango at 67348 82288)</span>
                  </Label>
                  <Input
                    id="kcNo"
                    placeholder="KC No"
                    value={formData.kcNo}
                    onChange={(e) => setFormData({ ...formData, kcNo: e.target.value })}
                    className={formErrors.kcNo ? "border-destructive" : ""}
                  />
                  {formErrors.kcNo && (
                    <p className="text-xs text-destructive">{formErrors.kcNo}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name*</Label>
                  <Input
                    id="schoolName"
                    placeholder="School Name"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className={formErrors.schoolName ? "border-destructive" : ""}
                  />
                  {formErrors.schoolName && (
                    <p className="text-xs text-destructive">{formErrors.schoolName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="kendraName">Nearest Karuna Kendra Name</Label>
                  <Input
                    id="kendraName"
                    placeholder="Nearest Karuna Kendra Name"
                    value={formData.kendraName}
                    onChange={(e) => setFormData({ ...formData, kendraName: e.target.value })}
                    className={formErrors.kendraName ? "border-destructive" : ""}
                  />
                  {formErrors.kendraName && (
                    <p className="text-xs text-destructive">{formErrors.kendraName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="principalName">School Principal's Name*</Label>
                  <Input
                    id="principalName"
                    placeholder="School Principal's Name"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className={formErrors.principalName ? "border-destructive" : ""}
                  />
                  {formErrors.principalName && (
                    <p className="text-xs text-destructive">{formErrors.principalName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">School Contact Number*</Label>
                  <Input
                    id="contactNumber"
                    placeholder="School Contact Number"
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className={formErrors.contactNumber ? "border-destructive" : ""}
                  />
                  {formErrors.contactNumber && (
                    <p className="text-xs text-destructive">{formErrors.contactNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schoolEmail">School Email ID*</Label>
                  <Input
                    id="schoolEmail"
                    type="email"
                    placeholder="School Email ID"
                    value={formData.schoolEmail}
                    onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                    className={formErrors.schoolEmail ? "border-destructive" : ""}
                  />
                  {formErrors.schoolEmail && (
                    <p className="text-xs text-destructive">{formErrors.schoolEmail}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Karuna Club Teacher In-charge Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Karuna Club Teacher In-charge</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teacherName">Name*</Label>
                  <Input
                    id="teacherName"
                    placeholder="Karuna Club Teacher In-charge Name"
                    value={formData.teacherName}
                    onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                    className={formErrors.teacherName ? "border-destructive" : ""}
                  />
                  {formErrors.teacherName && (
                    <p className="text-xs text-destructive">{formErrors.teacherName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherMobile">Mobile Number*</Label>
                  <Input
                    id="teacherMobile"
                    placeholder="Mobile Number"
                    value={formData.teacherMobile}
                    onChange={(e) => setFormData({ ...formData, teacherMobile: e.target.value })}
                    className={formErrors.teacherMobile ? "border-destructive" : ""}
                  />
                  {formErrors.teacherMobile && (
                    <p className="text-xs text-destructive">{formErrors.teacherMobile}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="teacherEmail">Email ID*</Label>
                  <Input
                    id="teacherEmail"
                    type="email"
                    placeholder="Email ID"
                    value={formData.teacherEmail}
                    onChange={(e) => setFormData({ ...formData, teacherEmail: e.target.value })}
                    className={formErrors.teacherEmail ? "border-destructive" : ""}
                  />
                  {formErrors.teacherEmail && (
                    <p className="text-xs text-destructive">{formErrors.teacherEmail}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddSchoolForm(false);
                setFormData({
                  kcNo: "",
                  schoolName: "",
                  kendraName: "",
                  principalName: "",
                  contactNumber: "",
                  schoolEmail: "",
                  teacherName: "",
                  teacherMobile: "",
                  teacherEmail: "",
                });
                setFormErrors({});
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleAddSchool} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
