import { useState } from "react";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, MapPin, Phone, Mail } from "lucide-react";

interface School {
  id: string;
  kc_no: string;
  school_name: string;
  principal_name: string;
  contact_number: string;
  email: string;
  chapter: string;
  active_students: number;
  submissions: number;
}

const mockSchools: School[] = [
  {
    id: "1",
    kc_no: "AHM-001",
    school_name: "St. Xavier's High School",
    principal_name: "Dr. Rajesh Kumar",
    contact_number: "+91 98765 43210",
    email: "principal@stxaviers.edu",
    chapter: "Ahmedabad",
    active_students: 450,
    submissions: 12
  },
  {
    id: "2",
    kc_no: "AHM-002",
    school_name: "Delhi Public School",
    principal_name: "Mrs. Priya Sharma",
    contact_number: "+91 98765 43211",
    email: "admin@dpsahmedabad.org",
    chapter: "Ahmedabad",
    active_students: 520,
    submissions: 15
  },
  {
    id: "3",
    kc_no: "NSK-001",
    school_name: "Kendriya Vidyalaya Nashik",
    principal_name: "Mr. Suresh Patil",
    contact_number: "+91 98765 43212",
    email: "kv.nashik@gmail.com",
    chapter: "Nashik",
    active_students: 380,
    submissions: 10
  },
  {
    id: "4",
    kc_no: "PUN-001",
    school_name: "Bishops School",
    principal_name: "Dr. Anjali Mehta",
    contact_number: "+91 98765 43213",
    email: "principal@bishops.ac.in",
    chapter: "Pune",
    active_students: 600,
    submissions: 18
  },
  {
    id: "5",
    kc_no: "MUM-001",
    school_name: "Campion School",
    principal_name: "Fr. Anthony D'Souza",
    contact_number: "+91 98765 43214",
    email: "office@campion.edu.in",
    chapter: "Mumbai",
    active_students: 480,
    submissions: 14
  },
  {
    id: "6",
    kc_no: "AHM-003",
    school_name: "Ryan International School",
    principal_name: "Ms. Kavita Desai",
    contact_number: "+91 98765 43215",
    email: "ryan.ahm@ryangroup.org",
    chapter: "Ahmedabad",
    active_students: 420,
    submissions: 11
  },
  {
    id: "7",
    kc_no: "DEL-001",
    school_name: "Sanskriti School Delhi",
    principal_name: "Mr. Ramesh Chand",
    contact_number: "+91 98765 43216",
    email: "info@sanskritischool.edu.in",
    chapter: "Delhi",
    active_students: 550,
    submissions: 16
  },
  {
    id: "8",
    kc_no: "PUN-002",
    school_name: "Symbiosis International School",
    principal_name: "Dr. Meera Joshi",
    contact_number: "+91 98765 43217",
    email: "sis@symbiosis.ac.in",
    chapter: "Pune",
    active_students: 490,
    submissions: 13
  }
];

const AdminSchools = () => {
  const [schools] = useState<School[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSchools = schools.filter(
    (school) =>
      school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.kc_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.chapter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Schools Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage all Karuna Clubs • {schools.length} schools • 3,850 active students
            </p>
          </div>
          <Button className="gap-2 bg-gradient-hero border-0">
            <Plus className="w-4 h-4" />
            Add School
          </Button>
        </div>

        <Card className="border-2">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-500/10 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">8</div>
                <div className="text-sm text-muted-foreground mt-1">Total Schools</div>
              </div>
              <div className="text-center p-4 bg-green-500/10 rounded-lg">
                <div className="text-3xl font-bold text-green-600">3,850</div>
                <div className="text-sm text-muted-foreground mt-1">Active Students</div>
              </div>
              <div className="text-center p-4 bg-purple-500/10 rounded-lg">
                <div className="text-3xl font-bold text-purple-600">109</div>
                <div className="text-sm text-muted-foreground mt-1">Total Submissions</div>
              </div>
              <div className="text-center p-4 bg-orange-500/10 rounded-lg">
                <div className="text-3xl font-bold text-orange-600">5</div>
                <div className="text-sm text-muted-foreground mt-1">Chapters</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by school name, KC No, or chapter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {filteredSchools.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No schools found matching your search</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchools.map((school) => (
              <Card key={school.id} className="hover:shadow-lg transition-all hover:border-primary/50 group">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-3">
                      <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                        {school.school_name}
                      </h3>
                      <Badge variant="secondary" className="shrink-0">
                        {school.kc_no}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="font-medium text-foreground">Principal:</span> {school.principal_name}
                      </p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span>{school.chapter} Chapter</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span>{school.contact_number}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate">{school.email}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex justify-between text-sm">
                      <div>
                        <div className="font-semibold text-foreground">{school.active_students}</div>
                        <div className="text-muted-foreground text-xs">Students</div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{school.submissions}</div>
                        <div className="text-muted-foreground text-xs">Submissions</div>
                      </div>
                      <Button size="sm" variant="outline">View Details</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSchools;
