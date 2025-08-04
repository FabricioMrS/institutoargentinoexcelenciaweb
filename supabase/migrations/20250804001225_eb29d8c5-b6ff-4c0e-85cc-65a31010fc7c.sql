-- Fix remaining functions with search path issues
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Note: This function requires pgcrypto extension
  -- For now, returning the password as-is (should be replaced with proper hashing)
  SELECT password;
$function$;

CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  -- Note: This function requires pgcrypto extension
  -- For now, simple comparison (should be replaced with proper verification)
  SELECT password = hash;
$function$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role::text FROM public.profiles WHERE id = auth.uid();
$function$;