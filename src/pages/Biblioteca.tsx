
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileList } from "@/components/biblioteca/FileList";
import { AuthDialog } from "@/components/AuthDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Briefcase, BookOpen } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";

const CATEGORIAS = [
  { 
    label: "Preparación Universitaria", 
    value: "Preparacion Universitaria", 
    gradient: "bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/60", 
    icon: BookOpen,
    iconColor: "text-blue-600 dark:text-blue-300"
  },
  { 
    label: "Orientado a Oficio", 
    value: "Oficio", 
    gradient: "bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/60", 
    icon: Briefcase,
    iconColor: "text-amber-600 dark:text-amber-300"
  }
];

const Biblioteca = () => {
  const { user } = useAuth();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const { theme } = useTheme();

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-6 sm:px-10 md:px-16 py-10 md:py-16 max-w-7xl mx-auto">
        {user ? (
          <div className="space-y-8 animate-fadeIn">
            <h1 className="text-3xl md:text-4xl font-bold text-center text-primary mb-6">Biblioteca Digital</h1>
            {!selectedCategoria ? (
              <>
                <div className="max-w-2xl mx-auto text-center mb-8">
                  <h2 className="text-lg md:text-xl font-semibold mb-4 text-center text-muted-foreground">
                    Elige una carpeta:
                  </h2>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                  {CATEGORIAS.map((item, idx) => {
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.value}
                        className={`
                          ${item.gradient}
                          cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col rounded-2xl w-[320px] md:w-[360px] max-w-full shadow-lg border-2 border-transparent hover:border-primary focus-visible:ring-2 focus-visible:ring-secondary group
                        `}
                        onClick={() => setSelectedCategoria(item.value)}
                        style={{ order: item.value === 'Preparacion Universitaria' ? 1 : 2 }}
                      >
                        <div className="flex flex-col items-center justify-center h-56 p-6 relative">
                          <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
                            {/* Círculos decorativos de fondo similares a cursos */}
                            <div
                              className="absolute inset-0 bg-repeat-space"
                              style={{
                                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.10\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")'
                              }}
                            ></div>
                          </div>
                          <IconComponent className={`h-16 w-16 mb-3 z-10 group-hover:scale-110 transition-transform ${item.iconColor}`} />
                          <span className={`text-xl md:text-2xl font-bold text-center z-10 ${item.value === 'Preparacion Universitaria' 
                              ? (theme === 'dark' ? 'text-white' : 'text-blue-800') 
                              : (theme === 'dark' ? 'text-white' : 'text-amber-800')
                            }`}>
                            {item.label}
                          </span>
                          <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium z-10 ${
                            item.value === 'Preparacion Universitaria'
                              ? (theme === 'dark'
                                ? 'bg-blue-700 text-white'
                                : 'bg-blue-100 text-blue-800')
                              : (theme === 'dark'
                                ? 'bg-amber-700 text-white'
                                : 'bg-amber-100 text-amber-800')
                          }`}>
                            {item.value === 'Preparacion Universitaria' ? 'Medicina' : 'Oficio'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
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
    </div>
  );
};

export default Biblioteca;
