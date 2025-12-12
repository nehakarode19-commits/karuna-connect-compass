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
import { Search, Eye, Loader2, Trophy, Filter, Download, Calendar } from "lucide-react";
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

const AdminReports = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("approved");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
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
        .order("score", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setSubmissions(data as Submission[]);
      } else {
        setSubmissions(demoSubmissions as Submission[]);
      }
    } catch (error: any) {
      setSubmissions(demoSubmissions as Submission[]);
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

  const rankedSubmissions = submissions
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
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((submission, index) => ({
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

  const handleExport = () => {
    toast({
      title: "Exporting Report",
      description: "Your submission ranking report is being generated...",
    });
  };

  const getStats = () => {
    const approved = submissions.filter(s => s.status === "approved");
    const avgScore = approved.length > 0 
      ? Math.round(approved.reduce((sum, s) => sum + (s.score || 0), 0) / approved.length) 
      : 0;
    return {
      total: submissions.length,
      approved: approved.length,
      avgScore,
      topScore: approved.length > 0 ? Math.max(...approved.map(s => s.score || 0)) : 0,
    };
  };

  const stats = getStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Submission Rankings Report</h1>
            <p className="text-muted-foreground">
              View school submissions ranked by score
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
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-primary">{stats.avgScore}</div>
              <div className="text-sm text-muted-foreground">Average Score</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold text-yellow-600">{stats.topScore}</div>
              <div className="text-sm text-muted-foreground">Top Score</div>
            </CardContent>
          </Card>
        </div>

        {/* Advanced Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">Filters</span>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
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
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
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
            </div>
          </CardContent>
        </Card>

        {/* Rankings Table */}
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
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
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
              <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Submissions Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see ranked submissions
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
