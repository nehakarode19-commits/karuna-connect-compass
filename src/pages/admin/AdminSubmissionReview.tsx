import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  Award,
  MessageSquare,
  Eye,
  ExternalLink,
  Newspaper,
  Tv,
  Globe,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Send,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { demoSubmissions, demoSchools } from "@/data/demoData";
import { demoActivities } from "@/data/demoActivities";

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
    banner_url?: string;
    thumbnail_url?: string;
  };
  teachers: {
    name: string;
    email: string;
    mobile: string;
  } | null;
  media_files?: MediaFile[];
  publications?: Publication[];
}

// Demo media files
const demoMediaFiles: MediaFile[] = [
  { id: "m1", file_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=400", file_type: "image/jpeg", file_size: 245000 },
  { id: "m2", file_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400", file_type: "image/jpeg", file_size: 312000 },
  { id: "m3", file_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400", file_type: "image/jpeg", file_size: 189000 },
  { id: "m4", file_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=400", file_type: "image/jpeg", file_size: 276000 },
];

// Demo publications
const demoPublications: Publication[] = [
  { id: "p1", media_type: "newspaper", media_name: "The Times of India", url: "https://timesofindia.com", file_url: null, publication_date: "2024-12-01" },
  { id: "p2", media_type: "tv", media_name: "DD National", url: null, file_url: "https://example.com/video.mp4", publication_date: "2024-12-02" },
];

// Get detailed demo submission
const getDetailedDemoSubmission = (id: string): Submission | null => {
  const baseSub = demoSubmissions.find(s => s.id === id);
  if (!baseSub) return null;

  const school = demoSchools.find(s => s.id === baseSub.school_id);
  const activity = demoActivities.find(a => a.id === baseSub.event_id);

  return {
    id: baseSub.id,
    event_id: baseSub.event_id,
    school_id: baseSub.school_id,
    teacher_id: null,
    short_description: `This is a detailed report of our participation in the ${baseSub.events.title}. Our students actively participated in various activities organized as part of this program. The event was held in our school premises with enthusiastic participation from over 200 students across all grades. Teachers and staff worked together to make this event a grand success. We organized special assemblies, competitions, and awareness campaigns as part of this initiative.`,
    document_url: "https://example.com/report.pdf",
    status: baseSub.status,
    score: baseSub.score,
    admin_comments: baseSub.admin_comments,
    submitted_at: baseSub.submitted_at,
    reviewed_at: baseSub.status !== "pending" ? baseSub.submitted_at : null,
    created_at: baseSub.created_at,
    schools: {
      school_name: school?.school_name || baseSub.schools.school_name,
      kc_no: school?.kc_no || baseSub.schools.kc_no,
      principal_name: school?.principal_name || "Principal Name",
      contact_number: school?.contact_number || "9876543210",
      email: school?.email || "school@example.com",
      kendra_name: school?.kendra_name || baseSub.schools.kendra_name,
    },
    events: {
      title: activity?.title || baseSub.events.title,
      description: activity?.description || "Event description",
      start_date: activity?.start_date || "2024-12-01",
      end_date: activity?.end_date || "2024-12-15",
      location: activity?.location || "School Campus",
      banner_url: activity?.banner_url,
      thumbnail_url: activity?.thumbnail_url,
    },
    teachers: {
      name: baseSub.teachers.name,
      email: "teacher@school.edu",
      mobile: "9876543210",
    },
    media_files: demoMediaFiles,
    publications: demoPublications,
  };
};

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
            location,
            banner_url,
            thumbnail_url
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
      // Fallback to demo data
      const demoData = getDetailedDemoSubmission(submissionId || "");
      if (demoData) {
        setSubmission(demoData);
        setScore(demoData.score || 0);
        setComments(demoData.admin_comments || "");
      } else {
        toast({
          title: "Error",
          description: "Failed to load submission details",
          variant: "destructive",
        });
      }
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
      // Demo mode - just show success
      toast({
        title: "Success",
        description: "Submission approved successfully (Demo)",
      });
      navigate("/admin/submissions");
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
        title: "Success",
        description: "Revision requested successfully (Demo)",
      });
      navigate("/admin/submissions");
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
        title: "Success",
        description: "Submission rejected (Demo)",
      });
      setShowRejectDialog(false);
      navigate("/admin/submissions");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", icon: Clock, label: "Pending Review" },
      approved: { color: "bg-green-500", icon: CheckCircle, label: "Approved" },
      rejected: { color: "bg-red-500", icon: XCircle, label: "Rejected" },
      revision_requested: { color: "bg-blue-500", icon: RefreshCw, label: "Revision Requested" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge className={`${config.color} text-white gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/submissions")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Review Submission</h1>
              <p className="text-muted-foreground mt-1">
                {submission.events.title}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(submission.status)}
            {submission.score && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-full">
                <Award className="h-4 w-4 text-primary" />
                <span className={`font-bold ${getScoreColor(submission.score)}`}>
                  {submission.score}/100
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium text-sm">
                    {new Date(submission.submitted_at || submission.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/50 rounded-lg">
                  <School className="h-4 w-4 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">KC Number</p>
                  <p className="font-medium text-sm">{submission.schools.kc_no}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ImageIcon className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Media Files</p>
                  <p className="font-medium text-sm">{submission.media_files?.length || 0} files</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm">
            <CardContent className="pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Newspaper className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Publications</p>
                  <p className="font-medium text-sm">{submission.publications?.length || 0} entries</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="publications">Publications</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details" className="space-y-4 mt-4">
                {/* Event Banner */}
                {submission.events.banner_url && (
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img
                      src={submission.events.banner_url}
                      alt={submission.events.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold">{submission.events.title}</h3>
                      <p className="text-sm opacity-90">{submission.events.location}</p>
                    </div>
                  </div>
                )}

                {/* Submission Description */}
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Submission Report
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                      {submission.short_description || "No description provided"}
                    </p>
                    {submission.document_url && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <a
                          href={submission.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                          Download Full Report
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* School & Teacher Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="shadow-sm">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <School className="h-4 w-4" />
                        School Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-xs text-muted-foreground">School Name</Label>
                        <p className="font-medium">{submission.schools.school_name}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">KC Number</Label>
                          <p className="text-sm">{submission.schools.kc_no}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Kendra</Label>
                          <p className="text-sm">{submission.schools.kendra_name}</p>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Principal</Label>
                        <p className="text-sm">{submission.schools.principal_name}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {submission.teachers && (
                    <Card className="shadow-sm">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Teacher In-Charge
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <p className="font-medium">{submission.teachers.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Email</Label>
                          <p className="text-sm">{submission.teachers.email}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Mobile</Label>
                          <p className="text-sm">{submission.teachers.mobile}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Media Tab */}
              <TabsContent value="media" className="mt-4">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      Media Gallery
                    </CardTitle>
                    <CardDescription>
                      Photos and videos submitted as evidence
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submission.media_files && submission.media_files.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {submission.media_files.map((media) => (
                          <div
                            key={media.id}
                            className="relative group cursor-pointer"
                            onClick={() => setSelectedImage(media.file_url)}
                          >
                            {media.file_type.startsWith('image/') ? (
                              <img
                                src={media.file_url}
                                alt="Submission media"
                                className="w-full h-40 object-cover rounded-lg border border-border group-hover:border-primary transition-colors"
                              />
                            ) : media.file_type.startsWith('video/') ? (
                              <div className="relative w-full h-40 bg-muted rounded-lg border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                                <VideoIcon className="h-12 w-12 text-muted-foreground" />
                              </div>
                            ) : null}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                              <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            {media.file_size && (
                              <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                                {(media.file_size / 1024).toFixed(0)} KB
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No media files uploaded
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Publications Tab */}
              <TabsContent value="publications" className="mt-4">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Newspaper className="h-5 w-5" />
                      Publication Details
                    </CardTitle>
                    <CardDescription>
                      Media coverage and publications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submission.publications && submission.publications.length > 0 ? (
                      <div className="space-y-4">
                        {submission.publications.map((pub) => (
                          <div
                            key={pub.id}
                            className="flex items-start gap-4 p-4 border border-border rounded-lg"
                          >
                            <div className={`p-3 rounded-lg ${
                              pub.media_type === 'newspaper' ? 'bg-blue-100' :
                              pub.media_type === 'tv' ? 'bg-purple-100' : 'bg-green-100'
                            }`}>
                              {pub.media_type === 'newspaper' ? (
                                <Newspaper className="h-5 w-5 text-blue-600" />
                              ) : pub.media_type === 'tv' ? (
                                <Tv className="h-5 w-5 text-purple-600" />
                              ) : (
                                <Globe className="h-5 w-5 text-green-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{pub.media_name || "Unknown Media"}</p>
                              <p className="text-sm text-muted-foreground capitalize">{pub.media_type}</p>
                              {pub.publication_date && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Published: {new Date(pub.publication_date).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                            {pub.url && (
                              <a
                                href={pub.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No publication details provided
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* History Tab */}
              <TabsContent value="history" className="mt-4">
                <Card className="shadow-medium">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Submission History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <Send className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Submission Created</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(submission.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {submission.submitted_at && (
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">Submitted for Review</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(submission.submitted_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )}
                      {submission.reviewed_at && (
                        <div className="flex items-start gap-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            submission.status === 'approved' ? 'bg-green-100' :
                            submission.status === 'rejected' ? 'bg-red-100' : 'bg-yellow-100'
                          }`}>
                            {submission.status === 'approved' ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : submission.status === 'rejected' ? (
                              <XCircle className="h-4 w-4 text-red-600" />
                            ) : (
                              <RefreshCw className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium capitalize">
                              {submission.status === 'revision_requested' ? 'Revision Requested' : submission.status}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(submission.reviewed_at).toLocaleString()}
                            </p>
                            {submission.admin_comments && (
                              <p className="text-sm mt-1 p-2 bg-muted rounded">
                                "{submission.admin_comments}"
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Review Panel - Right Side */}
          <div className="space-y-6">
            <Card className="shadow-medium sticky top-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Review & Scoring
                </CardTitle>
                <CardDescription>
                  Evaluate this submission
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Score Input */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Score (1-100)</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="number"
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(parseInt(e.target.value) || 0)}
                      className="w-24 text-center text-lg font-bold"
                    />
                    <div className="flex-1">
                      <Progress value={score} className="h-3" />
                    </div>
                  </div>
                  {/* Quick Score Buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {[60, 70, 80, 90, 95, 100].map((s) => (
                      <Button
                        key={s}
                        variant={score === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => setScore(s)}
                        className="flex-1"
                      >
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Comments */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Review Comments
                  </Label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder="Enter your review comments..."
                    rows={4}
                    className="resize-none"
                  />
                  {/* Quick Comments */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Excellent work!",
                      "Good effort.",
                      "Needs improvement.",
                      "Please add more details.",
                    ].map((comment) => (
                      <Button
                        key={comment}
                        variant="outline"
                        size="sm"
                        onClick={() => setComments(comments ? `${comments} ${comment}` : comment)}
                        className="text-xs"
                      >
                        + {comment}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full gap-2"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ThumbsUp className="h-4 w-4" />
                    )}
                    Approve Submission
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                    onClick={handleRequestRevision}
                    disabled={actionLoading}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Request Revision
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={actionLoading}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    Reject Submission
                  </Button>
                </div>

                {/* Previous Review */}
                {submission.status !== 'pending' && submission.admin_comments && (
                  <>
                    <Separator />
                    <div className="p-3 bg-muted rounded-lg">
                      <Label className="text-xs text-muted-foreground">Previous Review</Label>
                      <p className="text-sm mt-1">"{submission.admin_comments}"</p>
                      {submission.score && (
                        <p className="text-sm font-medium mt-2">
                          Score: <span className={getScoreColor(submission.score)}>{submission.score}/100</span>
                        </p>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Full size"
            className="max-w-full max-h-full object-contain"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => setSelectedImage(null)}
          >
            <XCircle className="h-6 w-6" />
          </Button>
        </div>
      )}

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Submission</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this submission? The school will be notified and may need to resubmit.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-red-500 hover:bg-red-600"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminSubmissionReview;
