
CREATE POLICY "Public read vatai media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'vatai-media');
