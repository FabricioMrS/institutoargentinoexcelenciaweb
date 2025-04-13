
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Shield, LockKeyhole, History, AlertCircle } from "lucide-react";
import MFASetup from "@/components/auth/MFASetup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const SecuritySettings = () => {
  const { user, isMFAEnabled, checkMFAStatus } = useAuth();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [sessionData, setSessionData] = useState<{
    currentSession: string | null;
    otherSessions: any[];
    loading: boolean;
  }>({
    currentSession: null,
    otherSessions: [],
    loading: true,
  });

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.auth.admin.listUserSessions(user.id);
      
      if (error) throw error;
      
      // Get current session
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      const currentSessionId = currentSession?.id;
      
      const otherSessions = data.sessions.filter(
        (session) => session.id !== currentSessionId
      );
      
      setSessionData({
        currentSession: currentSessionId,
        otherSessions,
        loading: false,
      });
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      setSessionData((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUserSession(user?.id || '', sessionId);
      
      if (error) throw error;
      
      // Recargar sesiones
      fetchSessions();
      
      toast({
        title: "Sesión cerrada",
        description: "La sesión ha sido cerrada correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al cerrar la sesión",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  const handleRevokeAllSessions = async () => {
    if (!user) return;
    
    try {
      // Mantener la sesión actual
      const { error } = await supabase.auth.admin.deleteAllUserSessions(user.id, {
        exceptSessionIds: [sessionData.currentSession || ''],
      });
      
      if (error) throw error;
      
      // Recargar sesiones
      fetchSessions();
      
      toast({
        title: "Sesiones cerradas",
        description: "Todas las demás sesiones han sido cerradas correctamente",
      });
    } catch (error: any) {
      toast({
        title: "Error al cerrar las sesiones",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    }
  };

  const handleRefreshMFAStatus = async () => {
    await checkMFAStatus();
  };

  const formatDateTime = (timestamp: string | null | undefined) => {
    if (!timestamp) return "Desconocido";
    
    try {
      return format(new Date(timestamp), "dd MMMM yyyy, HH:mm", { locale: es });
    } catch (e) {
      return "Formato inválido";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-5 justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Configuración de Seguridad</h1>
            <p className="text-muted-foreground mt-2">
              Administra la seguridad de tu cuenta y las sesiones activas
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleRefreshMFAStatus}
          >
            <History size={16} />
            Refrescar estado
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Configuración MFA */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Autenticación de dos factores
                </CardTitle>
                <Badge variant={isMFAEnabled ? "default" : "outline"}>
                  {isMFAEnabled ? "Activado" : "Desactivado"}
                </Badge>
              </div>
              <CardDescription>
                Añade una capa extra de seguridad a tu cuenta requiriendo un código de verificación al iniciar sesión.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isMFAEnabled ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-3 bg-muted/50">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          El 2FA está activado para tu cuenta
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Para desactivarlo, deberás contactar con soporte técnico.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setShowMFASetup(true)} className="w-full">
                  Activar 2FA
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Gestión de sesiones */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <LockKeyhole className="h-5 w-5 text-primary" />
                Sesiones activas
              </CardTitle>
              <CardDescription>
                Gestiona las sesiones activas en todos tus dispositivos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessionData.loading ? (
                  <p className="text-sm text-muted-foreground">Cargando sesiones...</p>
                ) : (
                  <>
                    <div className="rounded-lg border p-3">
                      <p className="text-sm font-medium mb-1">Sesión actual</p>
                      <p className="text-xs text-muted-foreground">
                        Último acceso: {formatDateTime(new Date().toISOString())}
                      </p>
                    </div>

                    {sessionData.otherSessions.length > 0 && (
                      <>
                        <Separator />
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Otras sesiones ({sessionData.otherSessions.length})</p>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleRevokeAllSessions}
                            >
                              Cerrar todas
                            </Button>
                          </div>
                          {sessionData.otherSessions.map((session) => (
                            <div
                              key={session.id}
                              className="rounded-lg border p-3 flex justify-between items-center"
                            >
                              <div>
                                <p className="text-xs text-muted-foreground">
                                  Último acceso: {formatDateTime(session.created_at)}
                                </p>
                              </div>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRevokeSession(session.id)}
                              >
                                Cerrar
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {sessionData.otherSessions.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No hay otras sesiones activas
                      </p>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Modal de configuración MFA */}
        {showMFASetup && (
          <MFASetup onClose={() => setShowMFASetup(false)} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SecuritySettings;
