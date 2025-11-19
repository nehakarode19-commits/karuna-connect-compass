import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Award, Clock, CheckCircle, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Exam {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_marks: number;
  status: string;
}

interface ExamAttempt {
  id: string;
  exam_id: string;
  marks_obtained: number;
  percentage: number;
  status: string;
  submitted_at: string;
}

export default function StudentDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchStudentData();
      fetchExams();
      fetchAttempts();
    }
  }, [user]);

  const fetchStudentData = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch student data",
        variant: "destructive",
      });
    } else {
      setStudent(data);
    }
  };

  const fetchExams = async () => {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .in("status", ['active', 'scheduled'])
      .order("start_time", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch exams",
        variant: "destructive",
      });
    } else {
      setExams(data || []);
    }
    setLoading(false);
  };

  const fetchAttempts = async () => {
    if (!student) return;

    const { data, error } = await supabase
      .from("exam_attempts")
      .select("*")
      .eq("student_id", student.id)
      .eq("status", "submitted");

    if (!error) {
      setAttempts(data || []);
    }
  };

  const isExamAvailable = (exam: Exam) => {
    const now = new Date();
    const start = new Date(exam.start_time);
    const end = new Date(exam.end_time);
    return exam.status === 'active' && now >= start && now <= end;
  };

  const hasAttempted = (examId: string) => {
    return attempts.some(a => a.exam_id === examId);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Student Portal</h1>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold">Welcome, {student?.name || 'Student'}</h2>
            <p className="text-muted-foreground">View and take your exams</p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Available Exams</p>
                  <h3 className="text-2xl font-bold">
                    {exams.filter(e => isExamAvailable(e) && !hasAttempted(e.id)).length}
                  </h3>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <h3 className="text-2xl font-bold">{attempts.length}</h3>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates</p>
                  <h3 className="text-2xl font-bold">{attempts.length}</h3>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Available Exams</h3>
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading exams...</p>
            ) : exams.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Exams Available</h3>
                  <p className="text-muted-foreground">
                    Check back later for upcoming exams
                  </p>
                </div>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {exams.map((exam) => {
                  const available = isExamAvailable(exam);
                  const attempted = hasAttempted(exam.id);
                  
                  return (
                    <Card key={exam.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-lg">{exam.title}</h4>
                            <p className="text-sm text-muted-foreground">{exam.description}</p>
                          </div>
                          <Badge variant={available ? 'default' : 'secondary'}>
                            {exam.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.duration_minutes} minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{exam.total_marks} marks</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{new Date(exam.start_time).toLocaleString()}</span>
                          </div>
                        </div>

                        {attempted ? (
                          <Button variant="outline" className="w-full" disabled>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Button>
                        ) : available ? (
                          <Button 
                            className="w-full"
                            onClick={() => navigate(`/student/exam/${exam.id}`)}
                          >
                            Start Exam
                          </Button>
                        ) : (
                          <Button variant="outline" className="w-full" disabled>
                            Not Available
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {attempts.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Your Results</h3>
              <div className="space-y-4">
                {attempts.map((attempt) => {
                  const exam = exams.find(e => e.id === attempt.exam_id);
                  return (
                    <Card key={attempt.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{exam?.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            Submitted on {new Date(attempt.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{attempt.percentage}%</p>
                          <p className="text-sm text-muted-foreground">
                            {attempt.marks_obtained} / {exam?.total_marks}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
