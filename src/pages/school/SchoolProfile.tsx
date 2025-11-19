import { SchoolLayout } from "./SchoolLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SchoolProfileForm } from "@/components/school/SchoolProfileForm";

const SchoolProfile = () => {
  return (
    <SchoolLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
            School Profile
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your school information and teacher details
          </p>
        </div>

        <Card className="shadow-medium border-border/50">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <SchoolProfileForm />
          </CardContent>
        </Card>
      </div>
    </SchoolLayout>
  );
};

export default SchoolProfile;
