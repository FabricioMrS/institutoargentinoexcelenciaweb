
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileList } from "@/components/biblioteca/FileList";
import { AuthDialog } from "@/components/AuthDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATEGORIAS = [
  { label: "Orientada a Oficio", value: "Oficio" },
  { label: "Preparación Universitaria", value: "Preparacion Universitaria" },
];

const Biblioteca = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);

  return (
    <div className="container py-8">
      {user ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-primary">Biblioteca Digital</h1>
          {!selectedCategoria ? (
            <div className="flex flex-col items-center mt-8 space-y-4">
              <h2 className="text-lg font-semibold">Elige una carpeta:</h2>
              <div className="flex gap-4">
                {CATEGORIAS.map((item) => (
                  <Button
                    key={item.value}
                    variant="outline"
                    className="text-base px-6 py-3 font-medium shadow-sm"
                    onClick={() => setSelectedCategoria(item.value)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-4 items-center pb-1">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategoria(null)}>
                  ⬅ Volver a elegir carpeta
                </Button>
                <span className="text-lg font-medium">
                  Carpeta: {CATEGORIAS.find(c => c.value === selectedCategoria)?.label}
                </span>
              </div>
              <div className="grid gap-6">
                <FileList categoria={selectedCategoria} />
              </div>
            </>
          )}
        </div>
      ) : (
        <Card className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="text-center text-[#FFD700] font-bold">Biblioteca Digital - Acceso Exclusivo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              La biblioteca es un beneficio exclusivo para usuarios registrados.
              Inicia sesión o regístrate gratuitamente para acceder a todo el contenido.
            </p>
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
