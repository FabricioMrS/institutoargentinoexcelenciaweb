
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { validateEmail, sanitizeText } from "@/utils/security";

interface ResetPasswordFormProps {
  loading: boolean;
  email: string;
  setEmail: (email: string) => void;
  resetEmailSent: boolean;
  onBack: () => void;
  onSubmit: () => Promise<void>;
}

export const ResetPasswordForm = ({
  loading,
  email,
  setEmail,
  resetEmailSent,
  onBack,
  onSubmit,
}: ResetPasswordFormProps) => {
  return resetEmailSent ? (
    <div className="space-y-4">
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Revisa tu bandeja de entrada y sigue las instrucciones enviadas a {email}
        </AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button
          variant="outline" 
          className="w-full"
          onClick={onBack}
        >
          Volver al inicio de sesión
        </Button>
      </div>
    </div>
  ) : (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email-reset">Email</Label>
        <Input
          id="email-reset"
          type="email"
          value={email}
          onChange={(e) => setEmail(sanitizeText(e.target.value))}
        />
      </div>
      <div className="flex gap-2">
        <Button
          className="w-full"
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </Button>
        <Button
          variant="outline"
          onClick={onBack}
          disabled={loading}
        >
          Volver
        </Button>
      </div>
    </div>
  );
};
