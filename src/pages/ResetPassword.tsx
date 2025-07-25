
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const [validResetFlow, setValidResetFlow] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Handle hash-based authentication tokens (from email links)
    const handleHashParams = () => {
      const hash = window.location.hash;
      if (hash) {
        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');
        
        console.log("Hash parameters found:", { accessToken: !!accessToken, refreshToken: !!refreshToken, type });
        
        if (accessToken && refreshToken && type === 'recovery') {
          console.log("Valid recovery tokens found in hash");
          setValidResetFlow(true);
          
          // Set the session with the tokens from the URL
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          }).then(({ data, error }) => {
            if (error) {
              console.error("Error setting session:", error);
              setValidResetFlow(false);
            } else {
              console.log("Session set successfully:", data);
              // Clear the hash from URL for security
              window.history.replaceState({}, document.title, window.location.pathname);
            }
          });
          
          return;
        }
      }
      
      // Check URL parameters as fallback
      const urlType = searchParams.get("type");
      const token = searchParams.get("token");
      
      console.log("URL parameters:", { type: urlType, token: !!token });
      
      if (urlType === "recovery" || token) {
        console.log("Valid recovery flow detected from URL params");
        setValidResetFlow(true);
      } else {
        console.log("No recovery parameters found");
        setValidResetFlow(false);
      }
    };

    handleHashParams();
  }, [searchParams]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "¡Éxito!",
        description: "Tu contraseña se ha actualizado correctamente",
      });
      
      setResetComplete(true);
      
      // Redirect to home after successful password update
      setTimeout(() => navigate("/"), 3000);
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la contraseña",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!validResetFlow) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Enlace no válido</CardTitle>
            <CardDescription>
              Este enlace de recuperación de contraseña no es válido o ha expirado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Por favor, solicita un nuevo enlace de recuperación de contraseña.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate("/")} className="w-full mt-4">
              Volver al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (resetComplete) {
    return (
      <div className="container flex items-center justify-center min-h-[80vh] py-8">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>¡Contraseña actualizada!</CardTitle>
            <CardDescription>
              Tu contraseña ha sido actualizada correctamente
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertTitle className="text-green-700">Éxito</AlertTitle>
              <AlertDescription className="text-green-600">
                Ahora puedes iniciar sesión con tu nueva contraseña.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate("/")} className="w-full mt-4 bg-green-600 hover:bg-green-700">
              Ir al inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-[80vh] py-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Recuperar contraseña</CardTitle>
          <CardDescription>
            Ingresa tu nueva contraseña para recuperar tu cuenta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirma tu nueva contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
