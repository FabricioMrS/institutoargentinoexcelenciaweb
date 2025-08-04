-- Update security functions to fix search path issues
CREATE OR REPLACE FUNCTION public.authenticate_user(email_input text, password_input text)
RETURNS TABLE(id text, nombre text, apellido text, email text, role text, vendedor_id text, activo boolean)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT 
    u.id::TEXT,
    u.nombre,
    u.apellido,
    u.email,
    u.role::TEXT,
    u.vendedor_id,
    u.activo
  FROM public.crm_users u
  WHERE u.email = email_input 
    AND u.activo = true
    AND public.verify_password(password_input, u.password_hash);
$function$;

-- Update get_current_user_id function
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT id FROM public.profiles WHERE id = auth.uid();
$function$;