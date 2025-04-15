
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !titulo || !categoria) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      // Subir el archivo
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('biblioteca')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Guardar los metadatos
      const { error: dbError } = await supabase
        .from('biblioteca_archivos')
        .insert({
          titulo,
          descripcion,
          categoria,
          archivo_path: filePath,
          archivo_nombre: file.name,
          tamano_bytes: file.size,
          tipo_archivo: file.type,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biblioteca-archivos'] });
      setFile(null);
      setTitulo("");
      setDescripcion("");
      setCategoria("");
      toast({
        title: "Archivo subido exitosamente",
        description: "El archivo ha sido agregado a la biblioteca",
      });
    },
    onError: (error) => {
      toast({
        title: "Error al subir el archivo",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Nuevo Archivo</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            uploadMutation.mutate();
          }}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="file">Archivo</Label>
            <Input
              id="file"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".zip,.rar,.7z"
            />
          </div>
          
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={uploadMutation.isPending || !file || !titulo || !categoria}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadMutation.isPending ? "Subiendo..." : "Subir Archivo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
