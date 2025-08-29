-- Verificar y actualizar el límite del bucket notification-videos a 2GB
UPDATE storage.buckets 
SET 
  file_size_limit = 2147483648, -- 2GB en bytes exactos
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov']
WHERE id = 'notification-videos';

-- Verificar el resultado
SELECT id, name, file_size_limit, allowed_mime_types, public 
FROM storage.buckets 
WHERE id = 'notification-videos';