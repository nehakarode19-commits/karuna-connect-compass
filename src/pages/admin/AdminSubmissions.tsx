import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, Loader2, FileText, Trophy, ArrowUpDown, Filter, Download, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { demoSubmissions, demoChapters } from "@/data/demoData";

interface Submission {
  id: string;
  event_id: string;
  school_id: string;
  status: string;
  score: number | null;
  submitted_at: string | null;
  created_at: string;
  schools: {
    school_name: string;
    kc_no: string;
    kendra_name: string;
  };
  events: {
    title: string;
  };
  teachers: {
    name: string;
  } | null;
}

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"rank" | "date" | "score">("rank");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [chapters, setChapters] = useState<string[]>([]);

  useEffect(() => {
    fetchSubmissions();
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from("chapters")
        .select("name")
        .order("name");

      if (error) throw error;

      if (data && data.length > 0) {
        setChapters(data.map((c) => c.name));
      } else {
        setChapters(demoChapters);
      }
    } catch (error) {
      setChapters(demoChapters);
    }
  };

  const fetchSubmissions = async () => {
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
            title
          ),
          teachers (
            name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSubmissions(data as Submission[]);
      } else {
        setSubmissions(demoSubmissions as Submission[]);
      }
    } catch (error: any) {
      setSubmissions(demoSubmissions as Submission[]);
      console.error("Using demo data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateFilterRange = () => {
    const now = new Date();
    switch (dateFilter) {
      case "today":
        return new Date(now.setHours(0, 0, 0, 0));
      case "week":
        return new Date(now.setDate(now.getDate() - 7));
      case "month":
        return new Date(now.setMonth(now.getMonth() - 1));
      case "quarter":
        return new Date(now.setMonth(now.getMonth() - 3));
      default:
        return null;
    }
  };

  const filteredAndSortedSubmissions = submissions
    .filter((submission) => {
      const matchesSearch =
        submission.schools.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.schools.kc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.events.title.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || submission.status === statusFilter;
      
      const matchesChapter = chapterFilter === "all" || 
        submission.schools.kendra_name.toLowerCase().includes(chapterFilter.toLowerCase());

      const dateRange = getDateFilterRange();
      const submissionDate = new Date(submission.submitted_at || submission.created_at);
      const matchesDate = !dateRange || submissionDate >= dateRange;

      return matchesSearch && matchesStatus && matchesChapter && matchesDate;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "score":
          comparison = (a.score || 0) - (b.score || 0);
          break;
        case "date":
          comparison = new Date(a.submitted_at || a.created_at).getTime() - 
                      new Date(b.submitted_at || b.created_at).getTime();
          break;
        case "rank":
        default:
          // Approved with highest score first, then pending, then rejected
          const statusOrder = { approved: 0, pending: 1, revision_requested: 2, rejected: 3 };
          const statusA = statusOrder[a.status as keyof typeof statusOrder] ?? 4;
          const statusB = statusOrder[b.status as keyof typeof statusOrder] ?? 4;
          if (statusA !== statusB) {
            comparison = statusA - statusB;
          } else {
            comparison = (b.score || 0) - (a.score || 0);
          }
          break;
      }
      
      return sortOrder === "desc" ? -comparison : comparison;
    });

  // Add rank to sorted submissions
  const rankedSubmissions = filteredAndSortedSubmissions.map((submission, index) => ({
    ...submission,
    rank: index + 1,
  }));

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

  const getSubmissionStats = () => {
    return {
      total: submissions.length,
      pending: submissions.filter((s) => s.status === "pending").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };
  };

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Your submission report is being generated...",
    });
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const stats = getSubmissionStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Submission Reports</h1>
            <p className="text-muted-foreground">
              View and analyze school activity submissions with rankings
            </p>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Submissions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-muted-foreground">Rejected</div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Advanced Filters</span>
            </div>
            <div className="grid gap-4 md:grid-cols-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search school, KC no, event..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="revision_requested">Revision Requested</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chapterFilter} onValueChange={setChapterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chapters</SelectItem>
                  {chapters.map((chapter) => (
                    <SelectItem key={chapter} value={chapter}>
                      {chapter}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                  <SelectItem value="quarter">Last 3 Months</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v) => setSortBy(v as "rank" | "date" | "score")}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rank">Rank (Score + Status)</SelectItem>
                  <SelectItem value="score">Score Only</SelectItem>
                  <SelectItem value="date">Submission Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submissions Table with Ranking */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : rankedSubmissions.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4" />
                        Rank
                      </div>
                    </TableHead>
                    <TableHead>School</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Chapter</TableHead>
                    <TableHead>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 p-0"
                        onClick={toggleSortOrder}
                      >
                        <Calendar className="w-4 h-4 mr-1" />
                        Date
                        <ArrowUpDown className="w-3 h-3 ml-1" />
                      </Button>
                    </TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rankedSubmissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell>
                        <div className="flex items-center justify-center">
                          {submission.rank <= 3 ? (
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                              submission.rank === 1 ? "bg-yellow-500" :
                              submission.rank === 2 ? "bg-gray-400" :
                              "bg-amber-700"
                            }`}>
                              {submission.rank}
                            </div>
                          ) : (
                            <span className="text-muted-foreground font-medium">
                              #{submission.rank}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{submission.schools.school_name}</div>
                          <div className="text-sm text-muted-foreground">{submission.schools.kc_no}</div>
                        </div>
                      </TableCell>
                      <TableCell>{submission.events.title}</TableCell>
                      <TableCell>{submission.schools.kendra_name}</TableCell>
                      <TableCell>
                        {new Date(submission.submitted_at || submission.created_at).toLocaleDateString('en-IN')}
                      </TableCell>
                      <TableCell>
                        {submission.score !== null ? (
                          <span className="font-bold text-primary">{submission.score}/100</span>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => navigate(`/admin/submissions/${submission.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || chapterFilter !== "all" || dateFilter !== "all"
                  ? "Try adjusting your filters"
                  : "No submissions have been received yet"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSubmissions;
