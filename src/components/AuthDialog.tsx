
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "./auth/LoginForm";
import { RegisterForm } from "./auth/RegisterForm";
import { ResetPasswordForm } from "./auth/ResetPasswordForm";

interface AuthDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const AuthDialog = ({ open, onOpenChange }: AuthDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      await resetPassword(email);
      setResetEmailSent(true);
    } catch (error) {
      console.error("Reset password error:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setShowResetPassword(false);
    setResetEmailSent(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  // Use the controlled open prop if provided, otherwise use local state
  const finalOpen = open ?? isOpen;
  const finalSetOpen = onOpenChange ?? setIsOpen;

  if (showResetPassword) {
    return (
      <Dialog open={finalOpen} onOpenChange={finalSetOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Iniciar sesión</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Recuperar contraseña</DialogTitle>
            <DialogDescription>
              {resetEmailSent 
                ? "Te hemos enviado un correo electrónico con un enlace para restablecer tu contraseña."
                : "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña"}
            </DialogDescription>
          </DialogHeader>
          <ResetPasswordForm
            loading={loading}
            email={email}
            setEmail={setEmail}
            resetEmailSent={resetEmailSent}
            onBack={resetForm}
            onSubmit={handleResetPassword}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={finalOpen} onOpenChange={finalSetOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Iniciar sesión</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Autenticación</DialogTitle>
          <DialogDescription>
            Inicia sesión o regístrate para acceder a todas las funcionalidades
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Iniciar sesión</TabsTrigger>
            <TabsTrigger value="register">Registrarse</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm
              onResetPassword={() => setShowResetPassword(true)}
              loading={loading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
            />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm
              loading={loading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
