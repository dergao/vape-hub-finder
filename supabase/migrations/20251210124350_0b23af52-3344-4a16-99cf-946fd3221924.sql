-- Create storage bucket for city images
INSERT INTO storage.buckets (id, name, public)
VALUES ('city-images', 'city-images', true);

-- Allow public read access to city images
CREATE POLICY "Public read access for city images"
ON storage.objects FOR SELECT
USING (bucket_id = 'city-images');

-- Allow authenticated users to upload city images
CREATE POLICY "Allow upload city images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'city-images');

-- Allow authenticated users to update city images
CREATE POLICY "Allow update city images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'city-images');

-- Allow authenticated users to delete city images
CREATE POLICY "Allow delete city images"
ON storage.objects FOR DELETE
USING (bucket_id = 'city-images');