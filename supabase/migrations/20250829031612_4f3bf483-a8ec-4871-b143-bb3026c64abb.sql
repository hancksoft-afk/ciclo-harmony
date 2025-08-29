-- Aumentar el límite del bucket notification-videos a 10GB para videos largos
UPDATE storage.buckets 
SET 
  file_size_limit = 10737418240, -- 10GB en bytes (10 * 1024 * 1024 * 1024)
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov']
WHERE id = 'notification-videos';

-- Verificar la configuración actualizada
SELECT id, name, file_size_limit, allowed_mime_types, public 
FROM storage.buckets 
WHERE id = 'notification-videos';