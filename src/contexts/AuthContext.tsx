
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
  setupMFA: () => Promise<{factorId: string, qrCode: string}>;
  verifyMFA: (factorId: string, code: string) => Promise<boolean>;
  isMFAEnabled: boolean;
  checkMFAStatus: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMFAEnabled, setIsMFAEnabled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user?.id) {
        checkAdminStatus(session.user.id);
        checkMFAStatus().catch(console.error);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user?.id) {
        // Use setTimeout to avoid possible deadlocks with Supabase auth state
        setTimeout(() => {
          checkAdminStatus(session.user?.id);
          checkMFAStatus().catch(console.error);
        }, 0);
      } else {
        setIsAdmin(false);
        setIsMFAEnabled(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const checkMFAStatus = async (): Promise<boolean> => {
    if (!user) {
      setIsMFAEnabled(false);
      return false;
    }

    try {
      const { data, error } = await supabase.auth.mfa.listFactors();
      
      if (error) {
        console.error('Error checking MFA status:', error);
        setIsMFAEnabled(false);
        return false;
      }
      
      const totp = data.totp.find(factor => factor.status === 'verified');
      setIsMFAEnabled(!!totp);
      return !!totp;
    } catch (error) {
      console.error('Error checking MFA status:', error);
      setIsMFAEnabled(false);
      return false;
    }
  };

  const setupMFA = async () => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }
    
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      });
      
      if (error) {
        toast({
          title: "Error al configurar MFA",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      return {
        factorId: data.id,
        qrCode: data.totp.qr_code,
      };
    } catch (error: any) {
      toast({
        title: "Error al configurar MFA",
        description: error.message || 'Ha ocurrido un error',
        variant: "destructive",
      });
      throw error;
    }
  };

  const verifyMFA = async (factorId: string, code: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code,
      });
      
      if (error) {
        toast({
          title: "Error de verificación",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      await checkMFAStatus();
      
      toast({
        title: "MFA configurado correctamente",
        description: "La autenticación de dos factores ha sido activada para tu cuenta",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error de verificación",
        description: error.message || 'Ha ocurrido un error',
        variant: "destructive",
      });
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      
      // Después de iniciar sesión correctamente, verificamos el estado MFA
      await checkMFAStatus();
    } catch (error: any) {
      toast({
        title: "Error de inicio de sesión",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Error de registro",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      } else {
        toast({
          title: "Registro exitoso",
          description: "Se ha enviado un correo de confirmación a tu email.",
        });
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: "Error de registro",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current site URL from the window location
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://institutoargentinoexcelencia.com';
      const resetUrl = `${baseUrl}/reset-password`;
      
      console.log("Enviando email de recuperación a:", email);
      console.log("URL de redirección:", resetUrl);
      
      // First step: Request password reset through Supabase
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      
      if (supabaseError) throw supabaseError;
      
      // Second step: try to send a personalized email, but continue if it fails
      try {
        // Make sure we use the correct full domain for the edge function
        const fullResetUrl = `${resetUrl}?type=recovery`;
        
        await supabase.functions.invoke('custom-reset-password', {
          body: {
            email,
            resetUrl: fullResetUrl,
          },
        });
        console.log("Correo personalizado enviado correctamente");
      } catch (edgeFunctionError) {
        console.warn("Error al enviar el correo personalizado:", edgeFunctionError);
        // We continue with the flow since the Supabase email was already sent
      }
      
      toast({
        title: "Correo enviado",
        description: "Se ha enviado un enlace para restablecer tu contraseña.",
      });
    } catch (error: any) {
      toast({
        title: "Error al enviar el correo",
        description: error.message || "No se pudo enviar el correo de recuperación",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signIn, 
      signUp, 
      signOut, 
      resetPassword, 
      isAdmin,
      setupMFA,
      verifyMFA,
      isMFAEnabled,
      checkMFAStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
