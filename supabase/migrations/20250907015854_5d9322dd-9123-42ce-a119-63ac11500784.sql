-- Update the get_active_qr_setting function to include price fields
CREATE OR REPLACE FUNCTION public.get_active_qr_setting(qr_type text)
 RETURNS TABLE(code_id text, remaining_time integer, qr_image_url text, price_usd decimal, price_cop decimal)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    qs.code_id,
    qs.remaining_time,
    qs.qr_image_url,
    qs.price_usd,
    qs.price_cop
  FROM qr_settings qs
  WHERE qs.type = qr_type 
    AND qs.is_active = true
  ORDER BY qs.updated_at DESC
  LIMIT 1;
END;
$function$