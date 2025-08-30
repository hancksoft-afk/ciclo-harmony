-- Verificar configuración actual del bucket
SELECT id, name, file_size_limit, allowed_mime_types, public 
FROM storage.buckets 
WHERE id = 'notification-videos';

-- Forzar actualización del límite del bucket notification-videos a 20GB
UPDATE storage.buckets 
SET 
  file_size_limit = 21474836480, -- 20GB en bytes (20 * 1024 * 1024 * 1024)
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov', 'video/mkv']
WHERE id = 'notification-videos';

-- Verificar que se aplicó el cambio
SELECT id, name, file_size_limit, allowed_mime_types, public 
FROM storage.buckets 
WHERE id = 'notification-videos';