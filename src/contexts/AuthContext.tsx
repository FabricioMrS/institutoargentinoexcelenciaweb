
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
      checkAdminStatus(session?.user?.id);
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
  };

  const signUp = async (email: string, password: string) => {
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
    }
  };

  const resetPassword = async (email: string) => {
    try {
      // Get the current site URL from the window location
      const baseUrl = window.location.origin;
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
