-- Allow comments with just media and add optional media attachments.
ALTER TABLE public.post_comments
  DROP CONSTRAINT IF EXISTS post_comments_content_check;

ALTER TABLE public.post_comments
  ADD CONSTRAINT post_comments_content_check
  CHECK (length(content) BETWEEN 0 AND 1000);

ALTER TABLE public.post_comments
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

-- Public bucket for comment attachments.
INSERT INTO storage.buckets (id, name, public)
VALUES ('comment-media', 'comment-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated uploads comment media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'comment-media');

CREATE POLICY "Authenticated updates comment media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'comment-media')
  WITH CHECK (bucket_id = 'comment-media');

CREATE POLICY "Authenticated deletes comment media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'comment-media');
