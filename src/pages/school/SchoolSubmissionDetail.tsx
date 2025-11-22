import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  FileText, 
  Image as ImageIcon, 
  Video as VideoIcon,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Submission {
  id: string;
  event_id: string;
  short_description: string | null;
  status: string;
  score: number | null;
  admin_comments: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  events: {
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
  };
  media_files?: Array<{
    id: string;
    file_url: string;
    file_type: string;
  }>;
  publications?: Array<{
    id: string;
    media_name: string | null;
    url: string | null;
    publication_date: string | null;
  }>;
}

const SchoolSubmissionDetail = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmission();
  }, [submissionId]);

  const fetchSubmission = async () => {
    try {
      const { data, error } = await supabase
        .from("event_submissions")
        .select(`
          *,
          events (
            title,
            description,
            start_date,
            end_date,
            location
          ),
          media_files (
            id,
            file_url,
            file_type
          ),
          publications (
            id,
            media_name,
            url,
            publication_date
          )
        `)
        .eq("id", submissionId)
        .single();

      if (error) throw error;
      setSubmission(data);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      approved: "default",
      rejected: "destructive",
      pending: "secondary",
    };
    return (
      <Badge variant={variants[status] || "secondary"} className="capitalize">
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (loading) {
    return (
      <SchoolLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SchoolLayout>
    );
  }

  if (!submission) {
    return (
      <SchoolLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Submission Not Found</h2>
          <Button onClick={() => navigate("/school/submissions")}>
            Back to Submissions
          </Button>
        </div>
      </SchoolLayout>
    );
  }

  return (
    <SchoolLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/school/submissions")}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Submission Details</h1>
              <p className="text-muted-foreground mt-1">{submission.events.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(submission.status)}
            {getStatusBadge(submission.status)}
          </div>
        </div>

        {/* Event Info */}
        <Card className="border-2">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Event Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Event Title</p>
                <p className="font-medium mt-1">{submission.events.title}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="mt-1">{submission.events.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Start Date</p>
                <p className="mt-1">{format(new Date(submission.events.start_date), "PPP")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">End Date</p>
                <p className="mt-1">{format(new Date(submission.events.end_date), "PPP")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submission Content */}
        <Card className="border-2">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Submission Content
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="whitespace-pre-wrap">{submission.short_description || "No description provided"}</p>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground mb-2">Submission Date</p>
              <p>{format(new Date(submission.submitted_at), "PPP 'at' p")}</p>
            </div>

            {submission.score && (
              <>
                <Separator />
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Score</p>
                    <div className="flex items-center gap-2">
                      <div className="text-3xl font-bold text-primary">{submission.score}</div>
                      <span className="text-muted-foreground">/ 100</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {submission.admin_comments && (
              <>
                <Separator />
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-sm text-muted-foreground mb-2 font-medium">Admin Comments</p>
                  <p>{submission.admin_comments}</p>
                  {submission.reviewed_at && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Reviewed on {format(new Date(submission.reviewed_at), "PPP")}
                    </p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Media Files */}
        {submission.media_files && submission.media_files.length > 0 && (
          <Card className="border-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Media Files ({submission.media_files.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {submission.media_files.map((media) => (
                  <div key={media.id} className="relative group">
                    {media.file_type.startsWith("image/") ? (
                      <img
                        src={media.file_url}
                        alt="Submission media"
                        className="w-full aspect-square object-cover rounded-lg border-2 hover:scale-105 transition-transform"
                      />
                    ) : media.file_type.startsWith("video/") ? (
                      <div className="relative w-full aspect-square bg-muted rounded-lg border-2 flex items-center justify-center">
                        <VideoIcon className="w-12 h-12 text-muted-foreground" />
                        <video
                          src={media.file_url}
                          className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          controls
                        />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publications */}
        {submission.publications && submission.publications.length > 0 && (
          <Card className="border-2">
            <CardHeader className="border-b bg-muted/20">
              <CardTitle>Publication Details</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {submission.publications.map((pub) => (
                <div key={pub.id} className="p-4 rounded-lg bg-muted/30 space-y-2">
                  {pub.media_name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Media Name</p>
                      <p className="font-medium">{pub.media_name}</p>
                    </div>
                  )}
                  {pub.publication_date && (
                    <div>
                      <p className="text-sm text-muted-foreground">Publication Date</p>
                      <p>{format(new Date(pub.publication_date), "PPP")}</p>
                    </div>
                  )}
                  {pub.url && (
                    <div>
                      <p className="text-sm text-muted-foreground">URL</p>
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {pub.url}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </SchoolLayout>
  );
};

export default SchoolSubmissionDetail;
