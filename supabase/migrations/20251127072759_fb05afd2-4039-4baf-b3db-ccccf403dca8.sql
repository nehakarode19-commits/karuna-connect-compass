-- Add UPDATE and DELETE policies for activity-media storage bucket
CREATE POLICY "Admins can update activity media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'activity-media' AND
  has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can delete activity media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'activity-media' AND
  has_role(auth.uid(), 'admin'::app_role)
);