-- Agregar política para que los admins puedan eliminar testimonios pendientes
CREATE POLICY "Admins can delete pending testimonials" 
ON pending_testimonials 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::app_role
  )
);

-- Agregar política para que los admins puedan actualizar testimonios pendientes (por si es necesario)
CREATE POLICY "Admins can update pending testimonials" 
ON pending_testimonials 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'::app_role
  )
);