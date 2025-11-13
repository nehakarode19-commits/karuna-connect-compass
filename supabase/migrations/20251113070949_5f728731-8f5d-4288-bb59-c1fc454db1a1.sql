-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'school_admin', 'student');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Create chapters table
CREATE TABLE public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  state TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create schools table
CREATE TABLE public.schools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  kc_no TEXT UNIQUE NOT NULL,
  school_name TEXT NOT NULL,
  principal_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  email TEXT NOT NULL,
  kendra_name TEXT NOT NULL,
  chapter_id UUID REFERENCES public.chapters(id),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  is_current BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create program_types table
CREATE TABLE public.program_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  program_type_id UUID REFERENCES public.program_types(id),
  location TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  thumbnail_url TEXT,
  status TEXT DEFAULT 'active',
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_assignments table
CREATE TABLE public.event_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.chapters(id),
  school_id UUID REFERENCES public.schools(id),
  assigned_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, school_id)
);

-- Create event_submissions table
CREATE TABLE public.event_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  teacher_id UUID REFERENCES public.teachers(id),
  short_description TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'pending',
  score INTEGER,
  admin_comments TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media_files table
CREATE TABLE public.media_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.event_submissions(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create publications table
CREATE TABLE public.publications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES public.event_submissions(id) ON DELETE CASCADE,
  media_type TEXT NOT NULL,
  media_name TEXT,
  publication_date DATE,
  url TEXT,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  school_id UUID NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  roll_no TEXT,
  name TEXT NOT NULL,
  mobile TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donors table
CREATE TABLE public.donors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create donations table
CREATE TABLE public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES public.donors(id),
  amount DECIMAL(10,2) NOT NULL,
  donation_type TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'completed',
  receipt_url TEXT,
  receipt_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON public.schools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_event_submissions_updated_at BEFORE UPDATE ON public.event_submissions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for chapters
CREATE POLICY "Everyone can view chapters"
  ON public.chapters FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage chapters"
  ON public.chapters FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for schools
CREATE POLICY "Schools can view their own data"
  ON public.schools FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Schools can update their own data"
  ON public.schools FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Schools can insert their own data"
  ON public.schools FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all schools"
  ON public.schools FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage all schools"
  ON public.schools FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for teachers
CREATE POLICY "Schools can manage their teachers"
  ON public.teachers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = teachers.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all teachers"
  ON public.teachers FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for program_types
CREATE POLICY "Everyone can view program types"
  ON public.program_types FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage program types"
  ON public.program_types FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for events
CREATE POLICY "Everyone can view active events"
  ON public.events FOR SELECT
  TO authenticated
  USING (status = 'active');

CREATE POLICY "Admins can manage all events"
  ON public.events FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for event_assignments
CREATE POLICY "Schools can view their assignments"
  ON public.event_assignments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = event_assignments.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all assignments"
  ON public.event_assignments FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for event_submissions
CREATE POLICY "Schools can view their submissions"
  ON public.event_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = event_submissions.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Schools can create their submissions"
  ON public.event_submissions FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = event_submissions.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Schools can update their submissions"
  ON public.event_submissions FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = event_submissions.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all submissions"
  ON public.event_submissions FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for media_files
CREATE POLICY "Users can view media for submissions they can see"
  ON public.media_files FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_submissions
      WHERE event_submissions.id = media_files.submission_id
      AND (
        EXISTS (
          SELECT 1 FROM public.schools
          WHERE schools.id = event_submissions.school_id
          AND schools.user_id = auth.uid()
        )
        OR public.has_role(auth.uid(), 'admin')
      )
    )
  );

CREATE POLICY "Schools can manage media for their submissions"
  ON public.media_files FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.event_submissions
      JOIN public.schools ON schools.id = event_submissions.school_id
      WHERE event_submissions.id = media_files.submission_id
      AND schools.user_id = auth.uid()
    )
  );

-- RLS Policies for publications
CREATE POLICY "Users can view publications for submissions they can see"
  ON public.publications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.event_submissions
      WHERE event_submissions.id = publications.submission_id
      AND (
        EXISTS (
          SELECT 1 FROM public.schools
          WHERE schools.id = event_submissions.school_id
          AND schools.user_id = auth.uid()
        )
        OR public.has_role(auth.uid(), 'admin')
      )
    )
  );

CREATE POLICY "Schools can manage publications for their submissions"
  ON public.publications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.event_submissions
      JOIN public.schools ON schools.id = event_submissions.school_id
      WHERE event_submissions.id = publications.submission_id
      AND schools.user_id = auth.uid()
    )
  );

-- RLS Policies for students
CREATE POLICY "Schools can manage their students"
  ON public.students FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.schools
      WHERE schools.id = students.school_id
      AND schools.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all students"
  ON public.students FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donors
CREATE POLICY "Admins can manage all donors"
  ON public.donors FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for donations
CREATE POLICY "Admins can manage all donations"
  ON public.donations FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default program types
INSERT INTO public.program_types (code, name, description) VALUES
('A', 'Intra School Activities', 'Activities conducted within a single school'),
('B', 'Inter School Activities', 'Activities conducted between multiple schools'),
('C', 'Public Relations', 'PR and community outreach activities'),
('D', 'Growth Programs', 'Programs focused on organizational growth'),
('E', 'National Level Events', 'Large-scale national competitions and events'),
('F', 'Special Programs', 'Other special activities and initiatives');

-- Insert default chapters
INSERT INTO public.chapters (name, location, state) VALUES
('Ahmedabad Chapter', 'Ahmedabad', 'Gujarat'),
('Nashik Chapter', 'Nashik', 'Maharashtra'),
('Pune Chapter', 'Pune', 'Maharashtra'),
('Mumbai Chapter', 'Mumbai', 'Maharashtra'),
('Delhi Chapter', 'Delhi', 'Delhi');