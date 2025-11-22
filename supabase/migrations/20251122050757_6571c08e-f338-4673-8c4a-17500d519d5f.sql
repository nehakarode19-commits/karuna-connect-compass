-- Drop existing evaluator policies if they exist
DROP POLICY IF EXISTS "Evaluators can view all events" ON public.events;
DROP POLICY IF EXISTS "Evaluators can view all submissions" ON public.event_submissions;
DROP POLICY IF EXISTS "Evaluators can update submissions" ON public.event_submissions;
DROP POLICY IF EXISTS "Evaluators can view all schools" ON public.schools;
DROP POLICY IF EXISTS "Evaluators can view all students" ON public.students;
DROP POLICY IF EXISTS "Evaluators can view all media files" ON public.media_files;
DROP POLICY IF EXISTS "Evaluators can view all publications" ON public.publications;

-- Grant evaluator permissions for viewing and evaluating submissions
-- Evaluators can view all events
CREATE POLICY "Evaluators can view all events" 
ON public.events 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can view all submissions
CREATE POLICY "Evaluators can view all submissions" 
ON public.event_submissions 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can update submissions (for scoring/evaluation)
CREATE POLICY "Evaluators can update submissions" 
ON public.event_submissions 
FOR UPDATE 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can view all schools
CREATE POLICY "Evaluators can view all schools" 
ON public.schools 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can view all students
CREATE POLICY "Evaluators can view all students" 
ON public.students 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can view media files
CREATE POLICY "Evaluators can view all media files" 
ON public.media_files 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));

-- Evaluators can view publications
CREATE POLICY "Evaluators can view all publications" 
ON public.publications 
FOR SELECT 
USING (has_role(auth.uid(), 'evaluator'));