
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileList } from "@/components/biblioteca/FileList";
import { AuthDialog } from "@/components/AuthDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";

const CATEGORIAS = [
  { label: "Orientada a Oficio", value: "Oficio", gradient: "from-[#9b87f5] to-[#D6BCFA]" },
  { label: "Preparación Universitaria", value: "Preparacion Universitaria", gradient: "from-[#7E69AB] to-[#1EAEDB]" },
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
            <div className="flex flex-col items-center mt-8 space-y-6 animate-fadeIn">
              <h2 className="text-lg sm:text-xl font-semibold mb-2 text-center">Elige una carpeta:</h2>
              <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
                {CATEGORIAS.map((item) => (
                  <button
                    key={item.value}
                    className={`
                      relative transition-all duration-200 group
                      rounded-2xl px-8 py-8 w-72 sm:w-80 shadow-xl
                      bg-gradient-to-br ${item.gradient}
                      ring-1 ring-secondary/30 hover:scale-105 hover:shadow-2xl focus:outline-none
                      flex flex-col items-center gap-3
                    `}
                    onClick={() => setSelectedCategoria(item.value)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="
                        bg-white bg-opacity-80 rounded-full p-4 mb-2 shadow
                        group-hover:bg-opacity-100 transition
                        ">
                        <Folder className="w-10 h-10 text-[#9b87f5] group-hover:text-[#7E69AB]" />
                      </div>
                      <span className="block text-lg font-semibold text-gray-800 group-hover:text-primary">{item.label}</span>
                    </div>
                  </button>
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

