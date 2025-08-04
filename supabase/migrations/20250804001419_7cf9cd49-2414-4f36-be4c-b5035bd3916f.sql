-- Fix the remaining password reset functions search path
CREATE OR REPLACE FUNCTION public.create_password_reset_token(email_input text)
RETURNS TABLE(token text, user_found boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  user_record RECORD;
  reset_token TEXT;
BEGIN
  -- Buscar usuario por email
  SELECT id, email INTO user_record 
  FROM crm_users 
  WHERE email = email_input AND activo = true;
  
  IF user_record.id IS NULL THEN
    RETURN QUERY SELECT NULL::TEXT, FALSE;
    RETURN;
  END IF;
  
  -- Generar token aleatorio
  reset_token := encode(gen_random_bytes(32), 'base64url');
  
  -- Invalidar tokens anteriores
  UPDATE password_reset_tokens 
  SET used = TRUE 
  WHERE user_id = user_record.id::uuid AND used = FALSE;
  
  -- Crear nuevo token (válido por 1 hora)
  INSERT INTO password_reset_tokens (user_id, token, expires_at)
  VALUES (user_record.id::uuid, reset_token, now() + interval '1 hour');
  
  RETURN QUERY SELECT reset_token, TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.verify_reset_token(token_input text)
RETURNS TABLE(user_id uuid, valid boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  token_record RECORD;
BEGIN
  -- Buscar token válido
  SELECT prt.user_id, prt.expires_at, prt.used
  INTO token_record
  FROM password_reset_tokens prt
  WHERE prt.token = token_input;
  
  -- Verificar si el token existe, no ha sido usado y no ha expirado
  IF token_record.user_id IS NULL OR 
     token_record.used = TRUE OR 
     token_record.expires_at < now() THEN
    RETURN QUERY SELECT NULL::UUID, FALSE;
    RETURN;
  END IF;
  
  RETURN QUERY SELECT token_record.user_id, TRUE;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_password_with_token(token_input text, new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  token_record RECORD;
  hashed_password TEXT;
BEGIN
  -- Verificar token
  SELECT prt.user_id, prt.expires_at, prt.used
  INTO token_record
  FROM password_reset_tokens prt
  WHERE prt.token = token_input;
  
  -- Verificar validez del token
  IF token_record.user_id IS NULL OR 
     token_record.used = TRUE OR 
     token_record.expires_at < now() THEN
    RETURN FALSE;
  END IF;
  
  -- Hashear nueva contraseña
  SELECT hash_password(new_password) INTO hashed_password;
  
  -- Actualizar contraseña del usuario
  UPDATE crm_users 
  SET password_hash = hashed_password, updated_at = now()
  WHERE id = token_record.user_id::uuid;
  
  -- Marcar token como usado
  UPDATE password_reset_tokens 
  SET used = TRUE 
  WHERE token = token_input;
  
  RETURN TRUE;
END;
$function$;