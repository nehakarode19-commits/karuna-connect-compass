import { useState, useRef } from "react";

import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Award, Download, Search, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import CertificateTemplate from "@/components/admin/CertificateTemplate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface CertificateData {
  id: string;
  schoolName: string;
  kcNo: string;
  activityTitle: string;
  score: number;
  certificateType: "Excellence" | "Merit" | "Participation";
  date: string;
}

// Demo data for certificates
const demoCertificates: CertificateData[] = [
  {
    id: "1",
    schoolName: "St. Mary's Convent School",
    kcNo: "KC-2024-001",
    activityTitle: "National Environment Day Celebration",
    score: 95,
    certificateType: "Excellence",
    date: "December 10, 2024",
  },
  {
    id: "2",
    schoolName: "Delhi Public School",
    kcNo: "KC-2024-002",
    activityTitle: "Inter-School Essay Competition",
    score: 88,
    certificateType: "Excellence",
    date: "December 8, 2024",
  },
  {
    id: "3",
    schoolName: "Kendriya Vidyalaya",
    kcNo: "KC-2024-003",
    activityTitle: "Kindness Week Campaign",
    score: 75,
    certificateType: "Merit",
    date: "December 5, 2024",
  },
  {
    id: "4",
    schoolName: "Ryan International School",
    kcNo: "KC-2024-004",
    activityTitle: "Community Service Drive",
    score: 82,
    certificateType: "Excellence",
    date: "December 3, 2024",
  },
  {
    id: "5",
    schoolName: "Army Public School",
    kcNo: "KC-2024-005",
    activityTitle: "Poster Making Competition",
    score: 68,
    certificateType: "Merit",
    date: "November 28, 2024",
  },
  {
    id: "6",
    schoolName: "Modern School Barakhamba",
    kcNo: "KC-2024-006",
    activityTitle: "Street Play on Compassion",
    score: 55,
    certificateType: "Participation",
    date: "November 25, 2024",
  },
  {
    id: "7",
    schoolName: "Springdales School",
    kcNo: "KC-2024-007",
    activityTitle: "Animal Welfare Awareness",
    score: 92,
    certificateType: "Excellence",
    date: "November 20, 2024",
  },
  {
    id: "8",
    schoolName: "The Shri Ram School",
    kcNo: "KC-2024-008",
    activityTitle: "Debate Competition",
    score: 45,
    certificateType: "Participation",
    date: "November 15, 2024",
  },
];

const AdminCertificates = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const filteredCertificates = demoCertificates.filter((cert) => {
    const matchesSearch =
      cert.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.kcNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.activityTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handlePreview = (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setPreviewOpen(true);
  };

  const handleDownload = async (cert: CertificateData) => {
    setSelectedCertificate(cert);
    setPreviewOpen(true);
    
    // Wait for dialog to render
    setTimeout(async () => {
      if (certificateRef.current) {
        try {
          const canvas = await html2canvas(certificateRef.current, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
          });
          
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF({
            orientation: "landscape",
            unit: "px",
            format: [canvas.width / 2, canvas.height / 2],
          });
          
          pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
          pdf.save(`Certificate_${cert.kcNo}_${cert.activityTitle.replace(/\s+/g, "_")}.pdf`);
          
          toast({
            title: "Certificate Downloaded",
            description: `Certificate for ${cert.schoolName} has been downloaded`,
          });
          
          setPreviewOpen(false);
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to generate certificate",
            variant: "destructive",
          });
        }
      }
    }, 500);
  };

  const handleBulkDownload = async () => {
    toast({
      title: "Generating Certificates",
      description: `Generating ${filteredCertificates.length} certificates...`,
    });

    for (let i = 0; i < Math.min(filteredCertificates.length, 3); i++) {
      await handleDownload(filteredCertificates[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    toast({
      title: "Success",
      description: "Certificates generated successfully",
    });
  };

  const excellenceCount = demoCertificates.filter((c) => c.certificateType === "Excellence").length;
  const meritCount = demoCertificates.filter((c) => c.certificateType === "Merit").length;
  const participationCount = demoCertificates.filter((c) => c.certificateType === "Participation").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Certificates</h1>
            <p className="text-muted-foreground mt-1">
              Generate and download certificates for approved submissions
            </p>
          </div>
          <Button
            onClick={handleBulkDownload}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80"
          >
            <Award className="w-4 h-4" />
            Generate All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-primary mb-1">
                {demoCertificates.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Eligible</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-yellow-600 mb-1">
                {excellenceCount}
              </div>
              <div className="text-sm text-muted-foreground">Excellence (80+)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-gray-500 mb-1">
                {meritCount}
              </div>
              <div className="text-sm text-muted-foreground">Merit (60-79)</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-700 mb-1">
                {participationCount}
              </div>
              <div className="text-sm text-muted-foreground">Participation</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by school name, KC number, or activity..."
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCertificates.map((cert) => (
                <div
                  key={cert.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold">{cert.schoolName}</h3>
                      <Badge
                        variant={
                          cert.certificateType === "Excellence"
                            ? "default"
                            : cert.certificateType === "Merit"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          cert.certificateType === "Excellence"
                            ? "bg-yellow-500 hover:bg-yellow-600"
                            : cert.certificateType === "Merit"
                            ? "bg-gray-400 hover:bg-gray-500"
                            : "border-orange-700 text-orange-700"
                        }
                      >
                        {cert.certificateType}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      KC No: {cert.kcNo} • Activity: {cert.activityTitle} • Score:{" "}
                      {cert.score}/100
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePreview(cert)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </Button>
                    <Button
                      onClick={() => handleDownload(cert)}
                      variant="default"
                      size="sm"
                      className="gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Certificate Preview Dialog */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent className="max-w-[900px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Certificate Preview</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center py-4 overflow-auto">
              {selectedCertificate && (
                <CertificateTemplate
                  ref={certificateRef}
                  schoolName={selectedCertificate.schoolName}
                  kcNo={selectedCertificate.kcNo}
                  activityTitle={selectedCertificate.activityTitle}
                  score={selectedCertificate.score}
                  certificateType={selectedCertificate.certificateType}
                  date={selectedCertificate.date}
                />
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewOpen(false)}>
                Close
              </Button>
              {selectedCertificate && (
                <Button onClick={() => handleDownload(selectedCertificate)} className="gap-2">
                  <Download className="w-4 h-4" />
                  Download PDF
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminCertificates;
