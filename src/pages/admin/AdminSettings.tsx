import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Settings, Database } from "lucide-react";

export default function AdminSettings() {
  const queryClient = useQueryClient();
  const [programDialogOpen, setProgramDialogOpen] = useState(false);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<any>(null);
  const [editingChapter, setEditingChapter] = useState<any>(null);

  // Program Types
  const { data: programTypes } = useQuery({
    queryKey: ["program-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const saveProgramMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingProgram) {
        const { error } = await supabase
          .from("program_types")
          .update(values)
          .eq("id", editingProgram.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("program_types").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-types"] });
      toast.success(`Program type ${editingProgram ? "updated" : "created"} successfully`);
      setProgramDialogOpen(false);
      setEditingProgram(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteProgramMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("program_types").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-types"] });
      toast.success("Program type deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  // Chapters
  const { data: chapters } = useQuery({
    queryKey: ["chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const saveChapterMutation = useMutation({
    mutationFn: async (values: any) => {
      if (editingChapter) {
        const { error } = await supabase
          .from("chapters")
          .update(values)
          .eq("id", editingChapter.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("chapters").insert(values);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success(`Chapter ${editingChapter ? "updated" : "created"} successfully`);
      setChapterDialogOpen(false);
      setEditingChapter(null);
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const deleteChapterMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("chapters").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chapters"] });
      toast.success("Chapter deleted");
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleProgramSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveProgramMutation.mutate({
      code: formData.get("code"),
      name: formData.get("name"),
      description: formData.get("description"),
    });
  };

  const handleChapterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    saveChapterMutation.mutate({
      name: formData.get("name"),
      location: formData.get("location"),
      state: formData.get("state"),
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage master data and configurations</p>
        </div>

        <Tabs defaultValue="programs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="programs" className="gap-2">
              <Database className="w-4 h-4" />
              Program Types
            </TabsTrigger>
            <TabsTrigger value="chapters" className="gap-2">
              <Settings className="w-4 h-4" />
              Chapters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="programs">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Program Types</CardTitle>
                    <CardDescription>Manage activity program types</CardDescription>
                  </div>
                  <Dialog open={programDialogOpen} onOpenChange={(open) => {
                    setProgramDialogOpen(open);
                    if (!open) setEditingProgram(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Program Type
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingProgram ? "Edit" : "Add"} Program Type</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleProgramSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="code">Code</Label>
                          <Input id="code" name="code" defaultValue={editingProgram?.code} required />
                        </div>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" defaultValue={editingProgram?.name} required />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" name="description" defaultValue={editingProgram?.description} />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingProgram ? "Update" : "Create"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {programTypes?.map((program) => (
                      <TableRow key={program.id}>
                        <TableCell className="font-medium">{program.code}</TableCell>
                        <TableCell>{program.name}</TableCell>
                        <TableCell>{program.description}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingProgram(program);
                              setProgramDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteProgramMutation.mutate(program.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chapters">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Chapters</CardTitle>
                    <CardDescription>Manage Karuna chapters</CardDescription>
                  </div>
                  <Dialog open={chapterDialogOpen} onOpenChange={(open) => {
                    setChapterDialogOpen(open);
                    if (!open) setEditingChapter(null);
                  }}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Chapter
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingChapter ? "Edit" : "Add"} Chapter</DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleChapterSubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" defaultValue={editingChapter?.name} required />
                        </div>
                        <div>
                          <Label htmlFor="location">Location</Label>
                          <Input id="location" name="location" defaultValue={editingChapter?.location} required />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" name="state" defaultValue={editingChapter?.state} required />
                        </div>
                        <Button type="submit" className="w-full">
                          {editingChapter ? "Update" : "Create"}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {chapters?.map((chapter) => (
                      <TableRow key={chapter.id}>
                        <TableCell className="font-medium">{chapter.name}</TableCell>
                        <TableCell>{chapter.location}</TableCell>
                        <TableCell>{chapter.state}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingChapter(chapter);
                              setChapterDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteChapterMutation.mutate(chapter.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
