
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const MFASetup = () => {
  const { setupMFA, verifyMFA, isMFAEnabled, checkMFAStatus } = useAuth();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleSetupMFA = async () => {
    setIsLoading(true);
    try {
      const { factorId, qrCode } = await setupMFA();
      setFactorId(factorId);
      setQrCode(qrCode);
      setShowSetup(true);
    } catch (error) {
      console.error("Error setting up MFA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!factorId || code.length !== 6) return;
    
    setIsLoading(true);
    try {
      const success = await verifyMFA(factorId, code);
      if (success) {
        setVerificationSuccess(true);
        await checkMFAStatus();
      }
    } catch (error) {
      console.error("Error verifying MFA:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleMFA = async (enabled: boolean) => {
    if (enabled && !isMFAEnabled) {
      handleSetupMFA();
    }
  };

  if (verificationSuccess) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle>Autenticación de dos factores</CardTitle>
          <CardDescription>La verificación en dos pasos está activa</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertTitle className="text-green-800">Configuración exitosa</AlertTitle>
            <AlertDescription className="text-green-700">
              Tu cuenta ahora está protegida con autenticación de dos factores.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => setVerificationSuccess(false)} 
            className="w-full"
            variant="outline"
          >
            Cerrar
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle>Autenticación de dos factores</CardTitle>
        <CardDescription>
          Protege tu cuenta con verificación adicional
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium">Verificación en dos pasos</p>
            <p className="text-xs text-muted-foreground">
              Añade una capa adicional de seguridad a tu cuenta
            </p>
          </div>
          <Switch 
            checked={showSetup || isMFAEnabled} 
            onCheckedChange={handleToggleMFA}
            disabled={isLoading || isMFAEnabled}
          />
        </div>

        {isMFAEnabled && !showSetup && (
          <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-400">Activo</AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-400">
              La autenticación de dos factores está habilitada para tu cuenta.
            </AlertDescription>
          </Alert>
        )}

        {showSetup && !isMFAEnabled && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription>
                Escanea el código QR con una aplicación de autenticación como Google Authenticator, Authy o Microsoft Authenticator.
              </AlertDescription>
            </Alert>

            {qrCode && (
              <div className="flex justify-center p-4 bg-white rounded-md">
                <div dangerouslySetInnerHTML={{ __html: qrCode }} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="otp">Ingresa el código de verificación:</Label>
              <InputOTP maxLength={6} value={code} onChange={setCode}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button 
              onClick={handleVerify} 
              className="w-full" 
              disabled={code.length !== 6 || isLoading}
            >
              {isLoading ? "Verificando..." : "Verificar"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
