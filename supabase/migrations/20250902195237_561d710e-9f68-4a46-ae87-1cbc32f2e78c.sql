-- Security fixes for critical vulnerabilities

-- 1. Fix privilege escalation on profiles table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Add secure RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (public.check_admin_access());

CREATE POLICY "Users can update their own profile (no role changes)" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id AND 
  role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
USING (public.check_admin_access());

-- 2. Lock down password_reset_tokens
-- Drop the public SELECT policy
DROP POLICY IF EXISTS "Users can view their own reset tokens" ON public.password_reset_tokens;

-- Add restrictive policy (only functions can access)
CREATE POLICY "No direct access to reset tokens" 
ON public.password_reset_tokens 
FOR SELECT 
USING (false);

-- 3. Fix biblioteca_archivos visibility
-- Drop overly permissive policy
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver archivos de la biblioteca" ON public.biblioteca_archivos;

-- Add authenticated-only policy
CREATE POLICY "Only authenticated users can view biblioteca files" 
ON public.biblioteca_archivos 
FOR SELECT 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- 4. Create abuse protection table for password reset
CREATE TABLE IF NOT EXISTS public.password_reset_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address TEXT NOT NULL,
  email TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on the new table
ALTER TABLE public.password_reset_attempts ENABLE ROW LEVEL SECURITY;

-- Only functions can manage this table
CREATE POLICY "No direct access to reset attempts" 
ON public.password_reset_attempts 
FOR ALL 
USING (false);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_attempts_ip_email_time 
ON public.password_reset_attempts (ip_address, email, attempted_at);

-- Function to check rate limiting
CREATE OR REPLACE FUNCTION public.check_password_reset_rate_limit(
  _ip_address TEXT,
  _email TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  -- Clean up old attempts (older than 1 hour)
  DELETE FROM public.password_reset_attempts 
  WHERE attempted_at < NOW() - INTERVAL '1 hour';
  
  -- Count recent attempts from this IP or email
  SELECT COUNT(*) INTO attempt_count
  FROM public.password_reset_attempts
  WHERE (ip_address = _ip_address OR email = _email)
    AND attempted_at > NOW() - INTERVAL '1 hour';
  
  -- Allow if less than 5 attempts in the last hour
  IF attempt_count < 5 THEN
    -- Log this attempt
    INSERT INTO public.password_reset_attempts (ip_address, email)
    VALUES (_ip_address, _email);
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$;