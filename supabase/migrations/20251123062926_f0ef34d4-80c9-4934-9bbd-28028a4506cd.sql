-- Add deadline to event_assignments table
ALTER TABLE public.event_assignments
ADD COLUMN deadline timestamp with time zone;

-- Update RLS policies to allow schools to see their assigned activities
CREATE POLICY "Schools can view activities assigned to them"
ON public.event_assignments
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.schools
    WHERE schools.id = event_assignments.school_id
    AND schools.user_id = auth.uid()
  )
  OR
  EXISTS (
    SELECT 1 FROM public.schools
    WHERE schools.chapter_id = event_assignments.chapter_id
    AND schools.user_id = auth.uid()
  )
);