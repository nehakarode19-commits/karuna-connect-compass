import { useEffect, useState } from "react";
import { EvaluatorLayout } from "./EvaluatorLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, School, TrendingUp, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const EvaluatorDashboard = () => {
  const [stats, setStats] = useState({
    pendingSubmissions: 0,
    totalSchools: 0,
    avgScore: 0,
    evaluatedToday: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: submissions } = await supabase
      .from("event_submissions")
      .select("*");

    const { data: schools } = await supabase
      .from("schools")
      .select("id");

    const pending = submissions?.filter(s => s.status === "pending").length || 0;
    const avgScore = submissions?.filter(s => s.score)
      .reduce((acc, s) => acc + (s.score || 0), 0) / (submissions?.filter(s => s.score).length || 1) || 0;

    setStats({
      pendingSubmissions: pending,
      totalSchools: schools?.length || 0,
      avgScore: Math.round(avgScore),
      evaluatedToday: 0,
    });
  };

  const statCards = [
    { title: "Pending Reviews", value: stats.pendingSubmissions.toString(), icon: ClipboardCheck, color: "text-orange-600", bgColor: "bg-orange-500/10" },
    { title: "Total Schools", value: stats.totalSchools.toString(), icon: School, color: "text-blue-600", bgColor: "bg-blue-500/10" },
    { title: "Average Score", value: `${stats.avgScore}%`, icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-500/10" },
    { title: "Evaluated Today", value: stats.evaluatedToday.toString(), icon: Award, color: "text-purple-600", bgColor: "bg-purple-500/10" },
  ];

  return (
    <EvaluatorLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Evaluator Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Review and evaluate school activity submissions
            </p>
          </div>
          <Badge variant="outline" className="text-sm px-3 py-1">
            Academic Year 2024-25
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <ClipboardCheck className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Review Pending</p>
                  <p className="text-sm text-muted-foreground">{stats.pendingSubmissions} submissions</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <Award className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">View Leaderboard</p>
                  <p className="text-sm text-muted-foreground">Top performers</p>
                </CardContent>
              </Card>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                <CardContent className="p-4 text-center">
                  <School className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <p className="font-medium">School Reports</p>
                  <p className="text-sm text-muted-foreground">{stats.totalSchools} schools</p>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </EvaluatorLayout>
  );
};

export default EvaluatorDashboard;
