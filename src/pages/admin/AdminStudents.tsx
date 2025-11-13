import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Upload, FileText, Award, Mail, Phone } from "lucide-react";

interface Student {
  id: string;
  name: string;
  roll_no: string;
  school: string;
  kc_no: string;
  email: string;
  mobile: string;
  exams_taken: number;
  rank: number | null;
  certificates: number;
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Aarav Sharma",
    roll_no: "2024001",
    school: "St. Xavier's High School",
    kc_no: "AHM-001",
    email: "aarav.sharma@student.edu",
    mobile: "+91 98765 00001",
    exams_taken: 3,
    rank: 15,
    certificates: 3
  },
  {
    id: "2",
    name: "Diya Patel",
    roll_no: "2024002",
    school: "Delhi Public School",
    kc_no: "AHM-002",
    email: "diya.patel@student.edu",
    mobile: "+91 98765 00002",
    exams_taken: 3,
    rank: 8,
    certificates: 3
  },
  {
    id: "3",
    name: "Arjun Reddy",
    roll_no: "2024003",
    school: "Kendriya Vidyalaya Nashik",
    kc_no: "NSK-001",
    email: "arjun.reddy@student.edu",
    mobile: "+91 98765 00003",
    exams_taken: 2,
    rank: 45,
    certificates: 2
  },
  {
    id: "4",
    name: "Ananya Deshmukh",
    roll_no: "2024004",
    school: "Bishops School",
    kc_no: "PUN-001",
    email: "ananya.d@student.edu",
    mobile: "+91 98765 00004",
    exams_taken: 3,
    rank: 3,
    certificates: 3
  },
  {
    id: "5",
    name: "Rohan Mehta",
    roll_no: "2024005",
    school: "Campion School",
    kc_no: "MUM-001",
    email: "rohan.mehta@student.edu",
    mobile: "+91 98765 00005",
    exams_taken: 3,
    rank: 1,
    certificates: 3
  },
  {
    id: "6",
    name: "Priya Singh",
    roll_no: "2024006",
    school: "Ryan International School",
    kc_no: "AHM-003",
    email: "priya.singh@student.edu",
    mobile: "+91 98765 00006",
    exams_taken: 2,
    rank: 22,
    certificates: 2
  }
];

const AdminStudents = () => {
  const [students] = useState<Student[]>(mockStudents);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.roll_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.school.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toppers = students.filter(s => s.rank && s.rank <= 10).sort((a, b) => (a.rank || 0) - (b.rank || 0));

  const stats = [
    { label: "Total Students", value: "12,450", color: "text-blue-600 bg-blue-500/10" },
    { label: "Registered This Year", value: "3,850", color: "text-green-600 bg-green-500/10" },
    { label: "Exams Completed", value: "8,920", color: "text-purple-600 bg-purple-500/10" },
    { label: "Certificates Issued", value: "7,240", color: "text-orange-600 bg-orange-500/10" }
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage student registration, exams, and certificates
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Upload className="w-4 h-4" />
              Bulk Upload
            </Button>
            <Button className="gap-2 bg-gradient-hero border-0">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className={`text-3xl font-bold mb-1 ${stat.color.split(' ')[0]}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Students</TabsTrigger>
            <TabsTrigger value="toppers">Top Performers</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card className="border-2">
              <CardHeader className="border-b bg-muted/20">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, roll number, or school..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Export List
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b bg-muted/20">
                      <tr>
                        <th className="text-left p-4 font-semibold text-sm">Roll No</th>
                        <th className="text-left p-4 font-semibold text-sm">Student Name</th>
                        <th className="text-left p-4 font-semibold text-sm">School</th>
                        <th className="text-left p-4 font-semibold text-sm">Contact</th>
                        <th className="text-left p-4 font-semibold text-sm">Exams</th>
                        <th className="text-left p-4 font-semibold text-sm">Rank</th>
                        <th className="text-left p-4 font-semibold text-sm">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="p-4">
                            <span className="font-mono text-sm">{student.roll_no}</span>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-xs text-muted-foreground">{student.email}</div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="text-sm">{student.school}</div>
                              <Badge variant="secondary" className="text-xs mt-1">{student.kc_no}</Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-3 h-3" />
                              <span className="text-xs">{student.mobile}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{student.exams_taken} taken</Badge>
                            </div>
                          </td>
                          <td className="p-4">
                            {student.rank ? (
                              <Badge className="bg-gradient-hero border-0">
                                Rank #{student.rank}
                              </Badge>
                            ) : (
                              <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </td>
                          <td className="p-4">
                            <Button size="sm" variant="outline">View Profile</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="toppers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {toppers.map((student, index) => (
                <Card key={student.id} className={`overflow-hidden ${index < 3 ? 'border-2 border-primary' : ''}`}>
                  <CardHeader className={index < 3 ? 'bg-gradient-hero text-primary-foreground' : 'bg-muted/20'}>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Rank #{student.rank}</CardTitle>
                      {index < 3 && <Award className="w-6 h-6" />}
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <h3 className="font-semibold text-xl mb-1">{student.name}</h3>
                      <p className="text-sm text-muted-foreground">{student.roll_no}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">School:</span>
                        <span className="font-medium">{student.school}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Exams Taken:</span>
                        <span className="font-medium">{student.exams_taken}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Certificates:</span>
                        <span className="font-medium">{student.certificates}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">View Profile</Button>
                      <Button size="sm" className="flex-1 gap-2">
                        <Mail className="w-3 h-3" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
