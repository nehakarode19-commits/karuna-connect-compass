-- Add approval status to schools table
ALTER TABLE public.schools 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approved_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Add status constraint if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'schools_status_check' 
    AND conrelid = 'public.schools'::regclass
  ) THEN
    ALTER TABLE public.schools 
    ADD CONSTRAINT schools_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;

-- Create exams table
CREATE TABLE IF NOT EXISTS public.exams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  duration_minutes integer NOT NULL,
  total_marks integer NOT NULL,
  passing_marks integer NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'active', 'completed', 'cancelled')),
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create exam questions table
CREATE TABLE IF NOT EXISTS public.exam_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  question_text text NOT NULL,
  option_a text NOT NULL,
  option_b text NOT NULL,
  option_c text NOT NULL,
  option_d text NOT NULL,
  correct_answer text NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  marks integer NOT NULL DEFAULT 1,
  order_number integer NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create student exam registrations table
CREATE TABLE IF NOT EXISTS public.exam_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  registration_date timestamp with time zone DEFAULT now(),
  payment_status text DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'waived')),
  payment_amount numeric,
  UNIQUE(exam_id, student_id)
);

-- Create student exam attempts table
CREATE TABLE IF NOT EXISTS public.exam_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id uuid REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  started_at timestamp with time zone DEFAULT now(),
  submitted_at timestamp with time zone,
  total_marks integer,
  marks_obtained integer,
  percentage numeric,
  status text DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'evaluated')),
  UNIQUE(exam_id, student_id)
);

-- Create student answers table
CREATE TABLE IF NOT EXISTS public.student_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id uuid REFERENCES public.exam_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id uuid REFERENCES public.exam_questions(id) ON DELETE CASCADE NOT NULL,
  selected_answer text CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct boolean,
  marks_awarded integer DEFAULT 0,
  answered_at timestamp with time zone DEFAULT now(),
  UNIQUE(attempt_id, question_id)
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  exam_id uuid REFERENCES public.exams(id) ON DELETE CASCADE,
  certificate_type text NOT NULL CHECK (certificate_type IN ('exam_participation', 'exam_topper', 'activity_excellence')),
  certificate_url text,
  issued_at timestamp with time zone DEFAULT now(),
  metadata jsonb
);

-- Enable RLS on new tables
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exam_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Drop and recreate schools view policy
DROP POLICY IF EXISTS "Schools can view their own data" ON public.schools;
DROP POLICY IF EXISTS "Approved schools can view their own data" ON public.schools;
CREATE POLICY "Approved schools can view their own data" ON public.schools 
  FOR SELECT USING (auth.uid() = user_id AND (status = 'approved' OR status IS NULL));

-- RLS Policies for exams
CREATE POLICY "Everyone can view active exams" ON public.exams FOR SELECT USING (status IN ('active', 'scheduled'));
CREATE POLICY "Admins can manage all exams" ON public.exams FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for exam questions
CREATE POLICY "Students can view questions during active exams" ON public.exam_questions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exams 
      WHERE exams.id = exam_questions.exam_id 
      AND exams.status = 'active'
    )
  );
CREATE POLICY "Admins can manage exam questions" ON public.exam_questions FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for exam registrations
CREATE POLICY "Students can view their registrations" ON public.exam_registrations 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = exam_registrations.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Students can register for exams" ON public.exam_registrations 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = exam_registrations.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all registrations" ON public.exam_registrations FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for exam attempts
CREATE POLICY "Students can view their attempts" ON public.exam_attempts 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = exam_attempts.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Students can create their attempts" ON public.exam_attempts 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = exam_attempts.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Students can update their attempts" ON public.exam_attempts 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = exam_attempts.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all attempts" ON public.exam_attempts FOR ALL USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for student answers
CREATE POLICY "Students can manage their answers" ON public.student_answers 
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.exam_attempts 
      JOIN public.students ON students.id = exam_attempts.student_id
      WHERE exam_attempts.id = student_answers.attempt_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can view all answers" ON public.student_answers FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for certificates
CREATE POLICY "Students can view their certificates" ON public.certificates 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.students 
      WHERE students.id = certificates.student_id 
      AND students.user_id = auth.uid()
    )
  );
CREATE POLICY "Admins can manage all certificates" ON public.certificates FOR ALL USING (has_role(auth.uid(), 'admin'));