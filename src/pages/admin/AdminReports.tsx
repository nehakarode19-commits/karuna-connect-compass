import { useState, useEffect } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Download, FileText, BarChart3, PieChart, TrendingUp, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AdminReports = () => {
  const { toast } = useToast();
  const [reportType, setReportType] = useState("activity");
  const [chapter, setChapter] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");
  const [chapters, setChapters] = useState<any[]>([]);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    const { data } = await supabase.from("chapters").select("*").order("name");
    if (data) setChapters(data);
  };

  const handleGenerateReport = async () => {
    toast({
      title: "Generating Report",
      description: "Your report is being prepared...",
    });
    // Add actual report generation logic here
  };
  const reportTypes = [
    {
      id: "activity",
      title: "Activity Reports",
      description: "Comprehensive reports on all school activities and submissions",
      icon: FileText,
      color: "text-blue-600 bg-blue-500/10"
    },
    {
      id: "donation",
      title: "Donation Reports",
      description: "Financial reports with donation analytics and trends",
      icon: TrendingUp,
      color: "text-green-600 bg-green-500/10"
    },
    {
      id: "exam",
      title: "Exam Results",
      description: "Student performance reports with rankings and certificates",
      icon: BarChart3,
      color: "text-purple-600 bg-purple-500/10"
    },
    {
      id: "leaderboard",
      title: "Leaderboards",
      description: "School and student rankings across all activities",
      icon: PieChart,
      color: "text-orange-600 bg-orange-500/10"
    }
  ];

  const recentReports = [
    { name: "Monthly Activity Summary - August 2024", date: "Sep 1, 2024", type: "Activity" },
    { name: "Donation Report Q2 2024", date: "Aug 28, 2024", type: "Donation" },
    { name: "Exam Results - Independence Day Quiz", date: "Aug 20, 2024", type: "Exam" },
    { name: "School Rankings - July 2024", date: "Aug 5, 2024", type: "Leaderboard" },
    { name: "Annual Report 2023-24", date: "Jul 15, 2024", type: "Comprehensive" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Generate comprehensive reports and export data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportTypes.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${report.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <report.icon className={`w-6 h-6 ${report.color.split(' ')[0]}`} />
                </div>
                <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground">{report.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-2">
          <CardHeader className="border-b bg-muted/20">
            <CardTitle>Generate New Report</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activity">Activity Report</SelectItem>
                    <SelectItem value="donation">Donation Report</SelectItem>
                    <SelectItem value="exam">Exam Results</SelectItem>
                    <SelectItem value="leaderboard">Leaderboard</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Chapter</Label>
                <Select value={chapter} onValueChange={setChapter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chapters</SelectItem>
                    {chapters.map((ch) => (
                      <SelectItem key={ch.id} value={ch.id}>{ch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="this-quarter">This Quarter</SelectItem>
                    <SelectItem value="this-year">This Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                Preview
              </Button>
              <Button onClick={handleGenerateReport} className="gap-2 bg-gradient-hero border-0 shadow-lg">
                <Download className="w-4 h-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/20">
            <CardTitle>Recent Reports</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {recentReports.map((report, index) => (
                <div key={index} className="p-4 hover:bg-muted/30 transition-colors flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium group-hover:text-primary transition-colors">
                        {report.name}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-3">
                        <span>{report.date}</span>
                        <span>•</span>
                        <span className="text-primary">{report.type}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
