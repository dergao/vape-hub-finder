-- Create storage bucket for store images
INSERT INTO storage.buckets (id, name, public)
VALUES ('store-images', 'store-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access
CREATE POLICY "Store images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'store-images');

-- Allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads to store-images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'store-images');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to store-images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'store-images');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated deletes from store-images"
ON storage.objects FOR DELETE
USING (bucket_id = 'store-images');