
import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      checkAdminStatus(session?.user?.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // Defer admin check to prevent deadlocks
      if (session?.user?.id) {
        setTimeout(() => {
          checkAdminStatus(session.user.id);
        }, 0);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminStatus = async (userId: string | undefined) => {
    if (!userId) {
      setIsAdmin(false);
      return;
    }

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

    setIsAdmin(data.role === 'admin');
  };

  const signIn = async (email: string, password: string) => {
    try {
      // Input validation
      if (!email || !email.includes("@")) {
        throw new Error("Email válido es requerido");
      }
      if (!password) {
        throw new Error("Contraseña es requerida");
      }

      // Clean up any existing auth state
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
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
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({
        title: "Error de inicio de sesión",
        description: error.message || "Error al iniciar sesión",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Input validation
      if (!email || !email.includes("@")) {
        throw new Error("Email válido es requerido");
      }
      if (!password || password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
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
      }
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({
        title: "Error de registro",
        description: error.message || "Error al registrarse",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const baseUrl = window.location.origin;
      const resetUrl = `${baseUrl}/reset-password`;
      
      console.log("Enviando email de recuperación a:", email);
      console.log("URL de redirección:", resetUrl);
      
      // Intentar vía función personalizada (Resend)
      const { data: edgeData, error: edgeFunctionError } = await supabase.functions.invoke('custom-reset-password', {
        body: {
          email,
          resetUrl,
        },
      });

      let enviado = false;

      if (edgeFunctionError) {
        console.error("Error en función personalizada:", edgeFunctionError);
      } else if (edgeData && typeof edgeData === 'object' && 'id' in (edgeData as any)) {
        // Resend devuelve un objeto con 'id' cuando el envío fue exitoso
        enviado = true;
      } else {
        // Si la función respondió 200 pero sin 'id' (p.ej. por rate limit), tratamos como no enviado
        console.warn("Función personalizada no confirmó envío. Respuesta:", edgeData);
      }

      // Fallback: usar el email nativo de Supabase si no se envió con Resend
      if (!enviado) {
        const { error: supaErr } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: resetUrl,
        });
        if (supaErr) {
          console.error("Error en fallback de Supabase:", supaErr);
          throw supaErr;
        }
      }
      
      toast({
        title: "Correo enviado",
        description: "Si el email está registrado, recibirás un enlace para restablecer tu contraseña.",
      });
    } catch (error: any) {
      console.error("Error al enviar el correo:", error);
      toast({
        title: "Error al enviar el correo",
        description: error.message || "No se pudo enviar el correo de recuperación",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      // Clean up auth state
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
          localStorage.removeItem(key);
        }
      });

      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) throw error;
      
      // Force page reload for clean state
      window.location.href = '/';
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({
        title: "Error al cerrar sesión",
        description: error.message || "Error al cerrar sesión",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, resetPassword, isAdmin }}>
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
