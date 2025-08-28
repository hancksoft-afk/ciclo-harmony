-- Actualizar configuración del bucket para permitir archivos más grandes
UPDATE storage.buckets 
SET 
  file_size_limit = 1572864000, -- 1,500MB en bytes (1500 * 1024 * 1024)
  allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov']
WHERE id = 'notification-videos';

-- Si el bucket no existe, crearlo con la configuración correcta
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'notification-videos', 
  'notification-videos', 
  true, 
  1572864000, -- 1,500MB
  ARRAY['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/avi', 'video/mov']
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;