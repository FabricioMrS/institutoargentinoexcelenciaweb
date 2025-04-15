
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileList } from "@/components/biblioteca/FileList";
import { LogIn } from "lucide-react";
import { AuthDialog } from "@/components/AuthDialog";
import { useState } from "react";

const Biblioteca = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  return (
    <div className="container py-8">
      {user ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Biblioteca Digital</h1>
          <div className="grid gap-6">
            <FileList />
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="text-center text-primary">Biblioteca Digital - Acceso Exclusivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              La biblioteca es un beneficio exclusivo para usuarios registrados.
              Inicia sesión o regístrate gratuitamente para acceder a todo el contenido.
            </p>
            <Button 
              onClick={() => setIsAuthDialogOpen(true)} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión / Registrarse
            </Button>
            <AuthDialog 
              open={isAuthDialogOpen} 
              onOpenChange={setIsAuthDialogOpen} 
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Biblioteca;
