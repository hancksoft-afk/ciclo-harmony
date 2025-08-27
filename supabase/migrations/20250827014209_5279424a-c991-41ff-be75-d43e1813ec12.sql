-- Create function to get active QR settings for register form
CREATE OR REPLACE FUNCTION public.get_active_qr_setting(qr_type TEXT)
RETURNS TABLE (
  code_id TEXT,
  remaining_time INTEGER,
  qr_image_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    qs.code_id,
    qs.remaining_time,
    qs.qr_image_url
  FROM qr_settings qs
  WHERE qs.type = qr_type 
    AND qs.is_active = true
  ORDER BY qs.updated_at DESC
  LIMIT 1;
END;
$$;