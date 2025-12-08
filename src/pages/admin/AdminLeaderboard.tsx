import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trophy, Medal, Award, Star, TrendingUp, School, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { demoLeaderboard, demoChapters } from "@/data/demoData";

interface LeaderboardEntry {
  school_id: string;
  school_name: string;
  kc_no: string;
  kendra_name: string;
  total_score: number;
  submissions_count: number;
  average_score: number;
  approved_submissions: number;
}

const AdminLeaderboard = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [chapterFilter, setChapterFilter] = useState("all");
  const [chapters, setChapters] = useState<string[]>([]);

  useEffect(() => {
    fetchLeaderboard();
    fetchChapters();
  }, [timeFilter, chapterFilter]);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from("schools")
        .select("kendra_name")
        .not("kendra_name", "is", null);

      if (error) throw error;

      if (data && data.length > 0) {
        const uniqueChapters = [...new Set(data.map((s) => s.kendra_name))].filter(Boolean);
        setChapters(uniqueChapters);
      } else {
        // Use demo chapters if no data
        setChapters(demoChapters);
      }
    } catch (error) {
      // Fallback to demo chapters
      setChapters(demoChapters);
      console.error("Using demo chapters:", error);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);

      // Build the query with filters
      let query = supabase
        .from("event_submissions")
        .select(`
          school_id,
          score,
          status,
          submitted_at,
          schools!inner (
            school_name,
            kc_no,
            kendra_name
          )
        `)
        .eq("status", "approved")
        .not("score", "is", null);

      // Apply time filter
      if (timeFilter !== "all") {
        const now = new Date();
        let startDate = new Date();

        switch (timeFilter) {
          case "week":
            startDate.setDate(now.getDate() - 7);
            break;
          case "month":
            startDate.setMonth(now.getMonth() - 1);
            break;
          case "quarter":
            startDate.setMonth(now.getMonth() - 3);
            break;
          case "year":
            startDate.setFullYear(now.getFullYear() - 1);
            break;
        }

        query = query.gte("submitted_at", startDate.toISOString());
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data && data.length > 0) {
        // Process data to calculate school scores
        const schoolScores = new Map<string, LeaderboardEntry>();

        data.forEach((submission: any) => {
          const schoolId = submission.school_id;
          const existing = schoolScores.get(schoolId);

          if (existing) {
            existing.total_score += submission.score || 0;
            existing.submissions_count += 1;
            existing.approved_submissions += 1;
          } else {
            schoolScores.set(schoolId, {
              school_id: schoolId,
              school_name: submission.schools.school_name,
              kc_no: submission.schools.kc_no,
              kendra_name: submission.schools.kendra_name,
              total_score: submission.score || 0,
              submissions_count: 1,
              average_score: 0,
              approved_submissions: 1,
            });
          }
        });

        // Calculate average scores and filter by chapter
        let leaderboardData = Array.from(schoolScores.values())
          .map((entry) => ({
            ...entry,
            average_score: Math.round(entry.total_score / entry.submissions_count),
          }))
          .filter((entry) => {
            if (chapterFilter === "all") return true;
            return entry.kendra_name === chapterFilter;
          })
          .sort((a, b) => b.average_score - a.average_score);

        setLeaderboard(leaderboardData);
      } else {
        // Use demo leaderboard if no data
        let filteredLeaderboard = demoLeaderboard;
        if (chapterFilter !== "all") {
          filteredLeaderboard = demoLeaderboard.filter(e => e.kendra_name === chapterFilter);
        }
        setLeaderboard(filteredLeaderboard);
      }
    } catch (error: any) {
      // Fallback to demo leaderboard
      setLeaderboard(demoLeaderboard);
      console.error("Using demo leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
    if (rank === 3) return "bg-gradient-to-r from-amber-400 to-amber-600 text-white";
    return "bg-muted text-foreground";
  };

  const getTopStats = () => {
    if (leaderboard.length === 0) return { totalSchools: 0, totalSubmissions: 0, avgScore: 0 };

    return {
      totalSchools: leaderboard.length,
      totalSubmissions: leaderboard.reduce((sum, s) => sum + s.submissions_count, 0),
      avgScore: Math.round(
        leaderboard.reduce((sum, s) => sum + s.average_score, 0) / leaderboard.length
      ),
    };
  };

  const stats = getTopStats();

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            School Leaderboard
          </h1>
          <p className="text-muted-foreground">
            Top-performing schools based on activity submission scores
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <School className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalSchools}</div>
                  <div className="text-sm text-muted-foreground">Participating Schools</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalSubmissions}</div>
                  <div className="text-sm text-muted-foreground">Total Submissions</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.avgScore}/100</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter leaderboard by time period and chapter</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-wrap">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={timeFilter} onValueChange={setTimeFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">Last Week</SelectItem>
                    <SelectItem value="month">Last Month</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Chapter</label>
                <Select value={chapterFilter} onValueChange={setChapterFilter}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select chapter" />
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
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              return (
                <Card
                  key={entry.school_id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    rank <= 3 ? "border-2 border-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0">
                        <div
                          className={`w-16 h-16 rounded-full ${getRankBadge(
                            rank
                          )} flex items-center justify-center font-bold text-2xl`}
                        >
                          {rank <= 3 ? getRankIcon(rank) : rank}
                        </div>
                      </div>

                      {/* School Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold truncate">
                          {entry.school_name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>KC No: {entry.kc_no}</span>
                          <span>•</span>
                          <span>{entry.kendra_name}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-center">
                        <div>
                          <div className="text-3xl font-bold text-primary">
                            {entry.average_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Avg Score</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold">{entry.submissions_count}</div>
                          <div className="text-xs text-muted-foreground">Submissions</div>
                        </div>
                        <div>
                          <div className="text-2xl font-semibold text-green-600">
                            {entry.total_score}
                          </div>
                          <div className="text-xs text-muted-foreground">Total Points</div>
                        </div>
                      </div>

                      {/* Badge */}
                      {rank <= 3 && (
                        <Badge className={getRankBadge(rank)}>
                          {rank === 1 ? "🥇 Champion" : rank === 2 ? "🥈 Runner-up" : "🥉 Third Place"}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Data Available</h3>
              <p className="text-muted-foreground">
                {chapterFilter !== "all" || timeFilter !== "all"
                  ? "No schools found with the selected filters"
                  : "No approved submissions yet. Start reviewing submissions to populate the leaderboard."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeaderboard;
