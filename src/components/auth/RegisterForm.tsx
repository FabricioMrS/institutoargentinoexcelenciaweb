
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail, validatePassword, sanitizeText, securityLogger } from "@/utils/security";

interface RegisterFormProps {
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
}

export const RegisterForm = ({
  loading,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
}: RegisterFormProps) => {
  const { signUp } = useAuth();

  const handleSubmit = async () => {
    try {
      // Validate email
      if (!validateEmail(email)) {
        securityLogger.warn("Invalid email format attempted during registration");
        throw new Error("Email inválido");
      }

      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error(passwordValidation.message);
      }

      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }

      const sanitizedEmail = sanitizeText(email);
      await signUp(sanitizedEmail, password);
    } catch (error) {
      securityLogger.error("Registration error occurred", error);
      throw error;
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-register">Email</Label>
        <Input
          id="email-register"
          type="email"
          value={email}
          onChange={(e) => setEmail(sanitizeText(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-register">Contraseña</Label>
        <Input
          id="password-register"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Registrarse"}
      </Button>
    </div>
  );
};
