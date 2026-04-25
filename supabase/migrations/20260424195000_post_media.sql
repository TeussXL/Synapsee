-- Add optional photo/video fields to posts and allow media-only post publishing.
ALTER TABLE public.posts
  ADD COLUMN IF NOT EXISTS media_url TEXT,
  ADD COLUMN IF NOT EXISTS media_type TEXT;

ALTER TABLE public.posts
  DROP CONSTRAINT IF EXISTS posts_content_check;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_content_check
  CHECK (length(content) BETWEEN 0 AND 2000 AND (length(content) > 0 OR media_url IS NOT NULL));

-- Public bucket for post attachments.
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-media', 'post-media', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated uploads post media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'post-media');

CREATE POLICY "Authenticated updates post media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'post-media')
  WITH CHECK (bucket_id = 'post-media');

CREATE POLICY "Authenticated deletes post media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'post-media');
