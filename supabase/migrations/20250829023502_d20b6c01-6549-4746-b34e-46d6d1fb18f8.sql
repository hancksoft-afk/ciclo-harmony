-- Actualizar el bucket para permitir videos de hasta 2GB
UPDATE storage.buckets 
SET 
  file_size_limit = 2147483648, -- 2GB en bytes (2048 * 1024 * 1024)
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov']
WHERE id = 'notification-videos';