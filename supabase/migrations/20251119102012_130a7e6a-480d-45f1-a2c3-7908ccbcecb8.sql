-- Update schools table to default status as 'approved'
ALTER TABLE public.schools 
ALTER COLUMN status SET DEFAULT 'approved';

-- Update any existing pending schools to approved
UPDATE public.schools 
SET status = 'approved' 
WHERE status = 'pending';