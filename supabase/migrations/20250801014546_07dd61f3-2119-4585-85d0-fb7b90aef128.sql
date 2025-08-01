-- Security Fix Migration: Critical RLS and Authentication Improvements

-- =============================================
-- PHASE 1: Fix Password Security Functions
-- =============================================

-- Install pgcrypto extension if not already installed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Fix password hashing function to use proper bcrypt
CREATE OR REPLACE FUNCTION public.hash_password(password text)
RETURNS text
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT crypt(password, gen_salt('bf', 12));
$function$;

-- Fix password verification function to use proper bcrypt verification
CREATE OR REPLACE FUNCTION public.verify_password(password text, hash text)
RETURNS boolean
LANGUAGE sql
IMMUTABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT (crypt(password, hash) = hash);
$function$;

-- =============================================
-- PHASE 2: Add search_path protection to all functions
-- =============================================

-- Update authenticate_user function
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

-- Update other functions with search_path protection
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

-- =============================================
-- PHASE 3: Fix Critical RLS Policies
-- =============================================

-- Remove overly permissive policies on crm_users table
DROP POLICY IF EXISTS "Allow public access to delete crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Allow public access to insert crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Allow public access to update crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Allow public access to view crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Users can delete crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Users can insert crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Users can update crm_users" ON public.crm_users;
DROP POLICY IF EXISTS "Users can view all crm_users" ON public.crm_users;

-- Create secure RLS policies for crm_users
CREATE POLICY "Only service role can manage crm_users" ON public.crm_users
FOR ALL USING (false) WITH CHECK (false);

-- Remove overly permissive policies on tasks table  
DROP POLICY IF EXISTS "Allow public access to delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow public access to insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow public access to update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow public access to view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can view all tasks" ON public.tasks;
DROP POLICY IF EXISTS "Usuarios autenticados pueden actualizar tareas" ON public.tasks;
DROP POLICY IF EXISTS "Usuarios autenticados pueden eliminar tareas" ON public.tasks;
DROP POLICY IF EXISTS "Usuarios autenticados pueden insertar tareas" ON public.tasks;
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver todas las tareas" ON public.tasks;

-- Keep only the secure role-based policies for tasks
-- (The existing role-based policies are already secure)

-- Remove overly permissive policies on clients table
DROP POLICY IF EXISTS "Allow public access to delete clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public access to insert clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public access to update clients" ON public.clients;
DROP POLICY IF EXISTS "Allow public access to view clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update clients" ON public.clients;
DROP POLICY IF EXISTS "Users can view all clients" ON public.clients;

-- Create secure RLS policies for clients (admin only for now)
CREATE POLICY "Admins can manage clients" ON public.clients
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'::app_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'::app_role
));

-- Remove overly permissive policies on sales_opportunities table
DROP POLICY IF EXISTS "Allow public access to delete sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Allow public access to insert sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Allow public access to update sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Allow public access to view sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Users can delete sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Users can insert sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Users can update sales_opportunities" ON public.sales_opportunities;
DROP POLICY IF EXISTS "Users can view all sales_opportunities" ON public.sales_opportunities;

-- Create secure RLS policies for sales_opportunities (admin only for now)
CREATE POLICY "Admins can manage sales_opportunities" ON public.sales_opportunities
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'::app_role
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE id = auth.uid() AND role = 'admin'::app_role
));

-- =============================================
-- PHASE 4: Improve admin role assignment security
-- =============================================

-- Update handle_new_user function to be more restrictive with admin assignment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      -- Only specific emails get admin access
      WHEN NEW.email IN ('fabriciosolovey@gmail.com', 'mdavicini@gmail.com') THEN 'admin'::app_role
      ELSE 'user'::app_role
    END
  );
  RETURN NEW;
END;
$function$;