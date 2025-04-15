
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileList } from "@/components/biblioteca/FileList";
import { LogIn } from "lucide-react";

const Biblioteca = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="container py-8">
      {user ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">Biblioteca Digital</h1>
          <div className="grid gap-6">
            <FileList />
          </div>
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Biblioteca Digital - Acceso Exclusivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              La biblioteca es un beneficio exclusivo para usuarios registrados.
              Inicia sesión o regístrate gratuitamente para acceder a todo el contenido.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión / Registrarse
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Biblioteca;
