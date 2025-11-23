import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface AssignActivityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventId: string;
  eventTitle: string;
}

export const AssignActivityDialog = ({ open, onOpenChange, eventId, eventTitle }: AssignActivityDialogProps) => {
  const [assignType, setAssignType] = useState<"school" | "chapter">("school");
  const [selectedId, setSelectedId] = useState("");
  const [deadline, setDeadline] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: schools } = useQuery({
    queryKey: ["schools"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("schools")
        .select("id, school_name, kendra_name")
        .eq("status", "approved")
        .order("school_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: chapters } = useQuery({
    queryKey: ["chapters"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("id, name, location")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const handleAssign = async () => {
    if (!selectedId || !deadline) {
      toast.error("Please select a target and deadline");
      return;
    }

    setIsSubmitting(true);
    try {
      const assignment = {
        event_id: eventId,
        deadline: deadline.toISOString(),
        ...(assignType === "school" ? { school_id: selectedId } : { chapter_id: selectedId }),
      };

      const { error } = await supabase.from("event_assignments").insert(assignment);

      if (error) throw error;

      toast.success(`Activity assigned successfully`);
      onOpenChange(false);
      setSelectedId("");
      setDeadline(undefined);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign activity");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign Activity: {eventTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Assign To</Label>
            <Select value={assignType} onValueChange={(value: "school" | "chapter") => {
              setAssignType(value);
              setSelectedId("");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="school">Specific School</SelectItem>
                <SelectItem value="chapter">Entire Chapter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>{assignType === "school" ? "Select School" : "Select Chapter"}</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder={`Choose ${assignType}...`} />
              </SelectTrigger>
              <SelectContent>
                {assignType === "school"
                  ? schools?.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.school_name} - {school.kendra_name}
                      </SelectItem>
                    ))
                  : chapters?.map((chapter) => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.name} - {chapter.location}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Deadline</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deadline ? format(deadline, "PPP") : "Select deadline..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={deadline} onSelect={setDeadline} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={isSubmitting}>
            {isSubmitting ? "Assigning..." : "Assign Activity"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
