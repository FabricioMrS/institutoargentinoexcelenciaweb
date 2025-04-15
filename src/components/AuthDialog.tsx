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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const { signIn, signUp, resetPassword } = useAuth();

  const handleSubmit = async (action: "login" | "register" | "reset") => {
    setLoading(true);
    try {
      if (action === "login") {
        await signIn(email, password);
        setIsOpen(false);
      } else if (action === "register") {
        if (password !== confirmPassword) {
          throw new Error("Las contraseñas no coinciden");
        }
        await signUp(email, password);
        setIsOpen(false);
      } else if (action === "reset") {
        await resetPassword(email);
        setResetEmailSent(true);
      }
    } catch (error) {
      console.error("Authentication error:", error);
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
          {resetEmailSent ? (
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
                  onClick={() => {
                    resetForm();
                  }}
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
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  className="w-full"
                  onClick={() => handleSubmit("reset")}
                  disabled={loading}
                >
                  {loading ? "Enviando..." : "Enviar enlace"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowResetPassword(false)}
                  disabled={loading}
                >
                  Volver
                </Button>
              </div>
            </div>
          )}
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
          <TabsContent value="login" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login">Email</Label>
                <Input
                  id="email-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={() => setShowResetPassword(true)}
              >
                ¿Olvidaste tu contraseña?
              </Button>
              <Button
                className="w-full"
                onClick={() => handleSubmit("login")}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="register" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-register">Email</Label>
                <Input
                  id="email-register"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                onClick={() => handleSubmit("register")}
                disabled={loading}
              >
                {loading ? "Cargando..." : "Registrarse"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
