-- Migration: 20260910000002_setup_storage_bucket.sql
-- Task 2.2: Setup Storage Bucket (depends: 2.1)

-- 1. Create or update storage bucket "project-images"
-- public = true, file_size_limit = 25MB (26214400 bytes), allowed_mime_types = image/jpeg, image/png, image/webp
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  26214400, -- 25MB (25 * 1024 * 1024 bytes)
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Storage Policy: SELECT (read) allowed untuk semua/public
DROP POLICY IF EXISTS "Allow public read on project-images" ON storage.objects;
CREATE POLICY "Allow public read on project-images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'project-images');

-- 3. Storage Policy: INSERT allowed hanya untuk authenticated role
DROP POLICY IF EXISTS "Allow authenticated insert on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated insert on project-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

-- 4. Storage Policy: DELETE allowed hanya untuk authenticated role
DROP POLICY IF EXISTS "Allow authenticated delete on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete on project-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- 5. Storage Policy: UPDATE allowed hanya untuk authenticated role (needed for upserting/replacing existing images)
DROP POLICY IF EXISTS "Allow authenticated update on project-images" ON storage.objects;
CREATE POLICY "Allow authenticated update on project-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');
