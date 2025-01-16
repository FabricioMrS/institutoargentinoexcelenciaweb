import { Moon, Sun, Home, Users, BookOpen, MessageSquare, User } from "lucide-react";
import { Button } from "./ui/button";
import { useTheme } from "@/hooks/useTheme";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <img
            src="/lovable-uploads/a56f0a36-7efa-4917-b6e5-a1064f93db33.png"
            alt="Logo"
            className="h-12 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <Home className="h-5 w-5" />
            Inicio
          </Button>
          <Button variant="ghost" onClick={() => navigate('/profesionales')} className="gap-2">
            <Users className="h-5 w-5" />
            Profesionales
          </Button>
          <Button variant="ghost" onClick={() => navigate('/cursos')} className="gap-2">
            <BookOpen className="h-5 w-5" />
            Cursos
          </Button>
          <Button variant="ghost" onClick={() => navigate('/nosotros')} className="gap-2">
            <User className="h-5 w-5" />
            Nosotros
          </Button>
          <Button variant="ghost" onClick={() => navigate('/contacto')} className="gap-2">
            <MessageSquare className="h-5 w-5" />
            Contacto
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </nav>
  );
};