-- Install pgcrypto extension and fix password security functions

-- Install pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update hash_password function with proper search_path and pgcrypto
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT crypt(password, gen_salt('bf', 12));
$function$;

-- Update verify_password function with proper search_path
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (crypt(password, hash) = hash);
$function$;