-- Step 1: Create user_roles table with proper structure
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles table
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 2: Create security definer function to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  );
$$;

-- Step 3: Create helper function to get user's primary role
CREATE OR REPLACE FUNCTION public.get_user_primary_role(_user_id UUID)
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'user' THEN 2
    END
  LIMIT 1;
$$;

-- Step 4: Migrate existing roles from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 5: Update check_admin_access function to use new system
CREATE OR REPLACE FUNCTION public.check_admin_access()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

-- Step 6: Update get_current_user_role function to use new system
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.get_user_primary_role(auth.uid())::TEXT;
$$;

-- Step 7: Update handle_new_user trigger to assign roles via user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role app_role;
BEGIN
  -- Determine role based on email
  IF NEW.email IN ('fabriciosolovey@gmail.com', 'mdavicini@gmail.com') THEN
    user_role := 'admin'::app_role;
  ELSE
    user_role := 'user'::app_role;
  END IF;

  -- Insert into profiles without role column
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Insert role into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, user_role);
  
  RETURN NEW;
END;
$$;

-- Step 8: Create RLS policies for user_roles table
-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 9: Update biblioteca_archivos RLS policies to use new role system
DROP POLICY IF EXISTS "Admin users can delete any file" ON public.biblioteca_archivos;
CREATE POLICY "Admin users can delete any file"
ON public.biblioteca_archivos
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Administradores pueden gestionar archivos de la biblioteca" ON public.biblioteca_archivos;
CREATE POLICY "Administradores pueden gestionar archivos de la biblioteca"
ON public.biblioteca_archivos
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 10: Update courses RLS policies
DROP POLICY IF EXISTS "Admin users can manage all courses" ON public.courses;
CREATE POLICY "Admin users can manage all courses"
ON public.courses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins pueden ver todos los cursos" ON public.courses;
CREATE POLICY "Admins pueden ver todos los cursos"
ON public.courses
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Solo admins pueden modificar cursos" ON public.courses;
CREATE POLICY "Solo admins pueden modificar cursos"
ON public.courses
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 11: Update professionals RLS policies
DROP POLICY IF EXISTS "Admin can insert/update/delete professionals" ON public.professionals;
CREATE POLICY "Admin can insert/update/delete professionals"
ON public.professionals
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 12: Update testimonials RLS policies
DROP POLICY IF EXISTS "Admin can insert/update/delete testimonials" ON public.testimonials;
CREATE POLICY "Admin can insert/update/delete testimonials"
ON public.testimonials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 13: Update pending_testimonials RLS policies
DROP POLICY IF EXISTS "Admins can delete pending testimonials" ON public.pending_testimonials;
CREATE POLICY "Admins can delete pending testimonials"
ON public.pending_testimonials
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can update pending testimonials" ON public.pending_testimonials;
CREATE POLICY "Admins can update pending testimonials"
ON public.pending_testimonials
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Only admins can view pending testimonials" ON public.pending_testimonials;
CREATE POLICY "Only admins can view pending testimonials"
ON public.pending_testimonials
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 14: Update course_lessons RLS policies
DROP POLICY IF EXISTS "Admins can manage all lessons" ON public.course_lessons;
CREATE POLICY "Admins can manage all lessons"
ON public.course_lessons
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 15: Update course_materials RLS policies
DROP POLICY IF EXISTS "Admins can manage course materials" ON public.course_materials;
CREATE POLICY "Admins can manage course materials"
ON public.course_materials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Step 16: Update course_financing_options RLS policies
DROP POLICY IF EXISTS "Solo admins pueden modificar opciones de financiación" ON public.course_financing_options;
CREATE POLICY "Solo admins pueden modificar opciones de financiación"
ON public.course_financing_options
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));