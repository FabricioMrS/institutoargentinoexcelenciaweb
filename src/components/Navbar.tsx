import { Moon, Sun, Home, Users, BookOpen, MessageSquare, User, LogOut, ExternalLink } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";
import { AuthDialog } from "./AuthDialog";
import { useAuth } from "@/contexts/AuthContext";
import { AcademyVirtualButton } from "./AcademyVirtualButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="w-full px-2 sm:px-4 md:container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-6">
          <img
            src="/lovable-uploads/f3cc75a2-3cce-4f6f-8a34-968ce9777ff6.png"
            alt="Logo"
            className="h-10 sm:h-12 md:h-14 w-auto max-w-[140px] sm:max-w-[180px] md:max-w-[220px] object-contain cursor-pointer transition-all"
            style={{ maxHeight: '3rem', objectFit: 'contain' }}
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
          <Button variant="ghost" size="sm" onClick={() => navigate('/biblioteca')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <BookOpen className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Biblioteca</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/nosotros')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <User className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Nosotros</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/contacto')} className="gap-1 sm:gap-2 px-2 sm:px-4">
            <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Contacto</span>
          </Button>
          
          <AcademyVirtualButton className="px-2 sm:px-4" />
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-4 w-4 sm:h-5 sm:w-5" /> : <Moon className="h-4 w-4 sm:h-5 sm:w-5" />}
          </Button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAdmin && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    Admin
                  </DropdownMenuItem>
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
    </nav>
  );
};
