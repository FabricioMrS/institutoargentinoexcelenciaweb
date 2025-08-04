
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { validateEmail, sanitizeText, securityLogger } from "@/utils/security";

interface LoginFormProps {
  onResetPassword: () => void;
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
}

export const LoginForm = ({
  onResetPassword,
  loading,
  email,
  setEmail,
  password,
  setPassword,
}: LoginFormProps) => {
  const { signIn } = useAuth();

  const handleSubmit = async () => {
    try {
      // Validate inputs
      if (!validateEmail(email)) {
        securityLogger.warn("Invalid email format attempted");
        return;
      }

      const sanitizedEmail = sanitizeText(email);
      await signIn(sanitizedEmail, password);
    } catch (error) {
      securityLogger.error("Login error occurred", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-login">Email</Label>
        <Input
          id="email-login"
          type="email"
          value={email}
          onChange={(e) => setEmail(sanitizeText(e.target.value))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-login">Contraseña</Label>
        <Input
          id="password-login"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button
        variant="link"
        className="px-0"
        onClick={onResetPassword}
      >
        ¿Olvidaste tu contraseña?
      </Button>
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Cargando..." : "Iniciar sesión"}
      </Button>
    </div>
  );
};
