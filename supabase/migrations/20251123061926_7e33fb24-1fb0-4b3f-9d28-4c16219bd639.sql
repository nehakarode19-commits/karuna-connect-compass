-- Create storage buckets for activity media
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('activity-media', 'activity-media', true),
  ('submission-media', 'submission-media', true),
  ('certificates', 'certificates', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for activity media
CREATE POLICY "Anyone can view activity media"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity-media');

CREATE POLICY "Admins can upload activity media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'activity-media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Storage policies for submission media
CREATE POLICY "Users can view their submission media"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'submission-media' AND
  (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'evaluator'::app_role) OR
    auth.uid()::text = (storage.foldername(name))[1]
  )
);

CREATE POLICY "Schools can upload submission media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'submission-media' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies for certificates
CREATE POLICY "Anyone can view certificates"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificates');

CREATE POLICY "Admins can manage certificates"
ON storage.objects FOR ALL
USING (
  bucket_id = 'certificates' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Add banner_url to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- Add attachments column to events table (for storing multiple file URLs as JSON)
ALTER TABLE events ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;