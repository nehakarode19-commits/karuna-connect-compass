import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  Calendar,
  School,
  User,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Star,
  Download,
  Image as ImageIcon,
  Video as VideoIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MediaFile {
  id: string;
  file_url: string;
  file_type: string;
  file_size: number | null;
}

interface Publication {
  id: string;
  media_type: string;
  media_name: string | null;
  url: string | null;
  file_url: string | null;
  publication_date: string | null;
}

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
  schools: {
    school_name: string;
    kc_no: string;
    principal_name: string;
    contact_number: string;
    email: string;
    kendra_name: string;
  };
  events: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  teachers: {
    name: string;
    email: string;
    mobile: string;
  } | null;
  media_files?: MediaFile[];
  publications?: Publication[];
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
            principal_name,
            contact_number,
            email,
            kendra_name
          ),
          events (
            title,
            description,
            start_date,
            end_date,
            location
          ),
          teachers (
            name,
            email,
            mobile
          ),
          media_files (
            id,
            file_url,
            file_type,
            file_size
          ),
          publications (
            id,
            media_type,
            media_name,
            url,
            file_url,
            publication_date
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
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!score || score < 1 || score > 100) {
      toast({
        title: "Invalid Score",
        description: "Please enter a score between 1 and 100",
        variant: "destructive",
      });
      return;
    }

    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide review comments",
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
        title: "Success",
        description: "Submission approved successfully",
      });
      navigate("/admin/submissions");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
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
        title: "Success",
        description: "Revision requested successfully",
      });
      navigate("/admin/submissions");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to request revision",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comments.trim()) {
      toast({
        title: "Comments Required",
        description: "Please provide reason for rejection",
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
          admin_comments: comments,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Submission rejected",
      });
      setShowRejectDialog(false);
      navigate("/admin/submissions");
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", label: "Pending" },
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
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold">Submission Not Found</h2>
          <Button className="mt-4" onClick={() => navigate("/admin/submissions")}>
            Back to Submissions
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
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/submissions")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Review Submission</h1>
              <p className="text-muted-foreground mt-1">
                {submission.events.title}
              </p>
            </div>
          </div>
          {getStatusBadge(submission.status)}
        </div>

        {/* Event Information */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Title</Label>
                <p className="font-medium mt-1">{submission.events.title}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Location</Label>
                <p className="mt-1">{submission.events.location || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Start Date</Label>
                <p className="mt-1">
                  {new Date(submission.events.start_date).toLocaleDateString()}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">End Date</Label>
                <p className="mt-1">
                  {new Date(submission.events.end_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <School className="h-5 w-5" />
              School Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">School Name</Label>
                <p className="font-medium mt-1">{submission.schools.school_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">KC Number</Label>
                <p className="mt-1">{submission.schools.kc_no}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Kendra Name</Label>
                <p className="mt-1">{submission.schools.kendra_name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Principal</Label>
                <p className="mt-1">{submission.schools.principal_name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Information */}
        {submission.teachers && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Teacher In-Charge
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-muted-foreground">Name</Label>
                  <p className="mt-1">{submission.teachers.name}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="mt-1">{submission.teachers.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Mobile</Label>
                  <p className="mt-1">{submission.teachers.mobile}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submission Details */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Submission Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="text-muted-foreground">Description</Label>
              <p className="mt-2 text-foreground whitespace-pre-wrap">
                {submission.short_description || "No description provided"}
              </p>
            </div>

            {submission.document_url && (
              <div>
                <Label className="text-muted-foreground">Document</Label>
                <a
                  href={submission.document_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline mt-2"
                >
                  <Download className="h-4 w-4" />
                  View Document
                </a>
              </div>
            )}

            {/* Media Files */}
            {submission.media_files && submission.media_files.length > 0 && (
              <div>
                <Label className="text-muted-foreground flex items-center gap-2 mb-3">
                  <ImageIcon className="h-4 w-4" />
                  Media Files ({submission.media_files.length})
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {submission.media_files.map((media) => (
                    <div key={media.id} className="relative group">
                      {media.file_type.startsWith('image/') ? (
                        <img
                          src={media.file_url}
                          alt="Submission media"
                          className="w-full h-40 object-cover rounded-lg border border-border"
                        />
                      ) : media.file_type.startsWith('video/') ? (
                        <div className="relative w-full h-40 bg-muted rounded-lg border border-border flex items-center justify-center">
                          <VideoIcon className="h-12 w-12 text-muted-foreground" />
                          <video
                            src={media.file_url}
                            className="absolute inset-0 w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 flex items-center justify-center bg-muted rounded-lg border border-border">
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <a
                        href={media.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                      >
                        <Download className="h-8 w-8 text-white" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Publications */}
            {submission.publications && submission.publications.length > 0 && (
              <div>
                <Label className="text-muted-foreground mb-3 block">
                  Publications ({submission.publications.length})
                </Label>
                <div className="space-y-3">
                  {submission.publications.map((pub) => (
                    <Card key={pub.id} className="p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <p className="font-medium">{pub.media_name || pub.media_type}</p>
                          {pub.publication_date && (
                            <p className="text-sm text-muted-foreground">
                              {new Date(pub.publication_date).toLocaleDateString()}
                            </p>
                          )}
                          {pub.url && (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-primary hover:underline block"
                            >
                              View Publication
                            </a>
                          )}
                        </div>
                        {pub.file_url && (
                          <a
                            href={pub.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80"
                          >
                            <Download className="h-5 w-5" />
                          </a>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Review Section */}
        {(submission.status === "pending" || submission.status === "revision_requested") && (
          <Card className="shadow-medium border-primary/20">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Review Submission
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="score" className="text-base font-semibold">
                    Score (out of 100)
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="score"
                      type="number"
                      min="0"
                      max="100"
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      placeholder="Enter score"
                      className="text-lg font-semibold pr-16"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      / 100
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2 flex-wrap">
                    <Badge variant={score >= 80 ? "default" : "outline"} className="cursor-default">
                      Excellent: 80-100
                    </Badge>
                    <Badge variant={score >= 60 && score < 80 ? "default" : "outline"} className="cursor-default">
                      Good: 60-79
                    </Badge>
                    <Badge variant={score > 0 && score < 60 ? "default" : "outline"} className="cursor-default">
                      Needs Work: 0-59
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <Label className="text-base font-semibold mb-2">Quick Score</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScore(100)}
                    >
                      Perfect (100)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScore(85)}
                    >
                      Excellent (85)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScore(70)}
                    >
                      Good (70)
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setScore(50)}
                    >
                      Average (50)
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="comments" className="text-base font-semibold">
                  Review Comments
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Provide detailed feedback on the submission..."
                  rows={6}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {comments.length} characters • Be specific and constructive
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading || !score || !comments.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white flex-1 md:flex-none"
                  size="lg"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  )}
                  Approve Submission
                </Button>

                <Button
                  onClick={handleRequestRevision}
                  disabled={actionLoading || !comments.trim()}
                  variant="outline"
                  size="lg"
                  className="flex-1 md:flex-none"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  )}
                  Request Revision
                </Button>

                <Button
                  onClick={() => setShowRejectDialog(true)}
                  disabled={actionLoading}
                  variant="destructive"
                  size="lg"
                  className="flex-1 md:flex-none"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>

              {(!score || !comments.trim()) && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  <AlertCircle className="h-4 w-4" />
                  Please provide both a score and comments to approve or request revision
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Previous Review */}
        {submission.status !== "pending" && submission.reviewed_at && (
          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Review Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {submission.score && (
                <div>
                  <Label className="text-muted-foreground">Score</Label>
                  <p className="text-2xl font-bold text-primary mt-1">
                    {submission.score} / 100
                  </p>
                </div>
              )}
              <div>
                <Label className="text-muted-foreground">Comments</Label>
                <p className="mt-1 whitespace-pre-wrap">{submission.admin_comments}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Reviewed On</Label>
                <p className="mt-1">
                  {new Date(submission.reviewed_at).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this submission. Make sure your comments explain why the submission doesn't meet the requirements.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="reject-comments">Rejection Reason</Label>
            <Textarea
              id="reject-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Explain why this submission is being rejected..."
              rows={4}
              className="mt-2"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={actionLoading || !comments.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSubmissionReview;
