
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2 } from "lucide-react";
import { FileUploader } from "./FileUploader";
import { useToast } from "@/components/ui/use-toast";

interface BibliotecaArchivo {
  id: string;
  titulo: string;
  descripcion: string | null;
  categoria: string;
  archivo_path: string;
  archivo_nombre: string;
  tamano_bytes: number | null;
  tipo_archivo: string | null;
}

export const FileList = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: archivos, isLoading } = useQuery({
    queryKey: ['biblioteca-archivos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('biblioteca_archivos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as BibliotecaArchivo[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (archivo: BibliotecaArchivo) => {
      // Primero eliminamos el archivo del storage
      const { error: storageError } = await supabase.storage
        .from('biblioteca')
        .remove([archivo.archivo_path]);

      if (storageError) throw storageError;

      // Luego eliminamos el registro de la base de datos
      const { error: dbError } = await supabase
        .from('biblioteca_archivos')
        .delete()
        .eq('id', archivo.id);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biblioteca-archivos'] });
      toast({
        title: "Archivo eliminado",
        description: "El archivo ha sido eliminado correctamente",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar el archivo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDelete = async (archivo: BibliotecaArchivo) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el archivo "${archivo.titulo}"?`)) {
      deleteMutation.mutate(archivo);
    }
  };

  const handleDownload = async (archivo: BibliotecaArchivo) => {
    try {
      const { data, error } = await supabase.storage
        .from('biblioteca')
        .download(archivo.archivo_path);

      if (error) throw error;

      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = archivo.archivo_nombre;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error al descargar:', error);
      toast({
        title: "Error al descargar",
        description: "No se pudo descargar el archivo",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Cargando archivos...</div>;
  }

  return (
    <div className="space-y-6">
      {isAdmin && <FileUploader />}
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {archivos?.map((archivo) => (
          <Card key={archivo.id}>
            <CardHeader>
              <CardTitle className="text-xl">{archivo.titulo}</CardTitle>
              <p className="text-sm text-muted-foreground">{archivo.categoria}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {archivo.descripcion && (
                <p className="text-sm text-muted-foreground">{archivo.descripcion}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {archivo.tamano_bytes 
                    ? `${Math.round(archivo.tamano_bytes / 1024)} KB` 
                    : 'Tamaño desconocido'}
                </span>
                <div className="flex gap-2">
                  <Button onClick={() => handleDownload(archivo)} variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  {isAdmin && (
                    <Button 
                      onClick={() => handleDelete(archivo)} 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
