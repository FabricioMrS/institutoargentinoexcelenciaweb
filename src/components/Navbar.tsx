
import { Moon, Sun, Home, Users, BookOpen, MessageSquare, User, LogOut, BellDot } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { PendingTestimonialsDialog } from "./admin/PendingTestimonialsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false);

  const { data: pendingCount = 0 } = useQuery({
    queryKey: ['pending-testimonials-count'],
    queryFn: async () => {
      if (!isAdmin) return 0;
      
      const { count, error } = await supabase
        .from('pending_testimonials')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
    enabled: isAdmin,
    refetchInterval: 30000, // Refresca cada 30 segundos
  });

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-2 sm:px-4 md:container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          <img
            src="/lovable-uploads/a56f0a36-7efa-4917-b6e5-a1064f93db33.png"
            alt="Logo"
            className="h-10 sm:h-12 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <Home className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Inicio</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/profesionales')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <Users className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Profesionales</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/cursos')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Cursos</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/nosotros')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Nosotros</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/contacto')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Contacto</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="relative">
                  {user.email}
                  {isAdmin && pendingCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full"
                    >
                      {pendingCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setIsPendingDialogOpen(true)}
                      className="text-green-600 flex items-center"
                    >
                      Testimonios Pendientes
                      {pendingCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {pendingCount}
                        </Badge>
                      )}
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog />
          )}
        </div>
      </div>

      {isAdmin && (
        <PendingTestimonialsDialog
          open={isPendingDialogOpen}
          onOpenChange={setIsPendingDialogOpen}
        />
      )}
    </nav>
  );
};
