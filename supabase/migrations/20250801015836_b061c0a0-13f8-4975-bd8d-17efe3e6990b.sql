-- Fix password security functions using available Supabase functions

-- Update hash_password function to use encode with digest (SHA-256 with salt)
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT encode(digest(password || 'supabase_salt_2024', 'sha256'), 'hex');
$function$;

-- Update verify_password function to use the same hash method
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT encode(digest(password || 'supabase_salt_2024', 'sha256'), 'hex') = hash;
$function$;