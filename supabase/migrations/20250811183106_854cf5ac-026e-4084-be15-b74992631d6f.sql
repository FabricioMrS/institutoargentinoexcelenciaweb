-- Actualizar contraseña del usuario admin mdavicini@gmail.com
UPDATE auth.users 
SET encrypted_password = crypt('DoctorMirco123##', gen_salt('bf'))
WHERE email = 'mdavicini@gmail.com';