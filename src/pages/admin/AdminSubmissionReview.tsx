import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Calendar, 
  School, 
  User,
  FileText,
  Image as ImageIcon,
  Video,
  Star,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Submission {
  id: string;
  event_id: string;
  school_id: string;
  teacher_id: string | null;
  short_description: string | null;
  document_url: string | null;
  status: string;
  score: number | null;
  admin_comments: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  schools: {
    school_name: string;
    kc_no: string;
    kendra_name: string;
  };
  events: {
    title: string;
    start_date: string;
    end_date: string;
  };
  teachers: {
    name: string;
    email: string;
  } | null;
}

const AdminSubmissionReview = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [score, setScore] = useState<number>(0);
  const [comments, setComments] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from("event_submissions")
        .select(`
          *,
          schools (
            school_name,
            kc_no,
            kendra_name
          ),
          events (
            title,
            start_date,
            end_date
          ),
          teachers (
            name,
            email
          )
        `)
        .eq("id", submissionId)
        .single();

      if (error) throw error;

      setSubmission(data);
      setScore(data.score || 0);
      setComments(data.admin_comments || "");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load submission details",
        variant: "destructive",
      });
      console.error("Error fetching submission:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (score < 1 || score > 100) {
      toast({
        title: "Invalid Score",
        description: "Please enter a score between 1 and 100",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("event_submissions")
        .update({
          status: "approved",
          score: score,
          admin_comments: comments,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Submission Approved",
        description: "The submission has been approved successfully",
      });

      navigate("/admin/activity");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("event_submissions")
        .update({
          status: "rejected",
          score: 0,
          admin_comments: rejectReason,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Submission Rejected",
        description: "The submission has been rejected",
      });

      navigate("/admin/activity");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to reject submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
      setShowRejectDialog(false);
    }
  };

  const handleRequestRevision = async () => {
    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide feedback for revision",
        variant: "destructive",
      });
      return;
    }

    setActionLoading(true);
    try {
      const { error } = await supabase
        .from("event_submissions")
        .update({
          status: "revision_requested",
          admin_comments: comments,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Revision Requested",
        description: "The school has been notified to revise their submission",
      });

      navigate("/admin/activity");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to request revision",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending Review" },
      approved: { color: "bg-green-500", label: "Approved" },
      rejected: { color: "bg-red-500", label: "Rejected" },
      revision_requested: { color: "bg-blue-500", label: "Revision Requested" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.color} text-white`}>
        {config.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Submission Not Found</h2>
          <Button onClick={() => navigate("/admin/activity")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/admin/activity")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Activities
          </Button>
          {getStatusBadge(submission.status)}
        </div>

        {/* Submission Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {submission.events.title}
            </CardTitle>
            <CardDescription>
              Submitted on {new Date(submission.submitted_at || submission.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* School Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <School className="w-4 h-4" />
                  <span className="font-semibold">School Details</span>
                </div>
                <div className="pl-6 space-y-1">
                  <p className="font-medium">{submission.schools.school_name}</p>
                  <p className="text-sm text-muted-foreground">KC No: {submission.schools.kc_no}</p>
                  <p className="text-sm text-muted-foreground">Kendra: {submission.schools.kendra_name}</p>
                </div>
              </div>

              {submission.teachers && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">Teacher In-Charge</span>
                  </div>
                  <div className="pl-6 space-y-1">
                    <p className="font-medium">{submission.teachers.name}</p>
                    <p className="text-sm text-muted-foreground">{submission.teachers.email}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Event Information */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span className="font-semibold">Event Period</span>
              </div>
              <div className="pl-6">
                <p className="text-sm">
                  {new Date(submission.events.start_date).toLocaleDateString('en-IN')} - {new Date(submission.events.end_date).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            <Separator />

            {/* Submission Content */}
            <div className="space-y-4">
              <h3 className="font-semibold">Submission Description</h3>
              {submission.short_description ? (
                <p className="text-sm whitespace-pre-wrap bg-muted p-4 rounded-lg">
                  {submission.short_description}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">No description provided</p>
              )}
            </div>

            {submission.document_url && (
              <div className="space-y-2">
                <h3 className="font-semibold">Attached Document</h3>
                <Button variant="outline" size="sm" asChild>
                  <a href={submission.document_url} target="_blank" rel="noopener noreferrer">
                    <FileText className="w-4 h-4 mr-2" />
                    View Document
                  </a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Section */}
        {submission.status === "pending" || submission.status === "revision_requested" ? (
          <Card>
            <CardHeader>
              <CardTitle>Review Submission</CardTitle>
              <CardDescription>
                Evaluate the submission and provide feedback
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="score">
                  Score (1-100) <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="score"
                    type="number"
                    min="1"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                    placeholder="Enter score"
                    className="max-w-xs"
                  />
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          score >= (i + 1) * 20
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="comments">Admin Comments</Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback for the school..."
                  rows={6}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                  )}
                  Approve
                </Button>

                <Button
                  onClick={handleRequestRevision}
                  disabled={actionLoading}
                  variant="outline"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50"
                >
                  {actionLoading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <AlertCircle className="w-4 h-4 mr-2" />
                  )}
                  Request Revision
                </Button>

                <Button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={actionLoading}
                  variant="outline"
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Review Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.score !== null && (
                <div>
                  <Label>Score</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-2xl font-bold">{submission.score}/100</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            submission.score && submission.score >= (i + 1) * 20
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {submission.admin_comments && (
                <div>
                  <Label>Admin Comments</Label>
                  <p className="mt-1 p-4 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                    {submission.admin_comments}
                  </p>
                </div>
              )}

              {submission.reviewed_at && (
                <div>
                  <Label>Reviewed On</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(submission.reviewed_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Submission</DialogTitle>
            <DialogDescription>
              Please provide a clear reason for rejection. This will be shared with the school.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter detailed reason for rejection..."
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4 mr-2" />
              )}
              Reject Submission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminSubmissionReview;
