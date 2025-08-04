
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { validateFileUpload, sanitizeText, sanitizeFilename, securityLogger } from "@/utils/security";

interface Props {
  categoriaSeleccionada?: string;
}

export const FileUploader = ({ categoriaSeleccionada }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    if (categoriaSeleccionada) {
      setCategoria(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada]);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !titulo || !categoria) {
        throw new Error("Por favor complete todos los campos requeridos");
      }

      // Validate file security
      const fileValidation = validateFileUpload(file);
      if (!fileValidation.isValid) {
        securityLogger.warn("File upload validation failed", { filename: file.name, type: file.type, size: file.size });
        throw new Error(fileValidation.message);
      }

      // Sanitize inputs
      const sanitizedTitulo = sanitizeText(titulo);
      const sanitizedDescripcion = sanitizeText(descripcion);
      const sanitizedCategoria = sanitizeText(categoria);
      
      // Create secure filename
      const fileExt = file.name.split('.').pop();
      const sanitizedFilename = sanitizeFilename(file.name);
      const filePath = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      securityLogger.info("Uploading file", { originalName: file.name, sanitizedName: sanitizedFilename, path: filePath });

      const { error: uploadError } = await supabase.storage
        .from('biblioteca')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Guardar los metadatos
      const { error: dbError } = await supabase
        .from('biblioteca_archivos')
        .insert({
          titulo: sanitizedTitulo,
          descripcion: sanitizedDescripcion,
          categoria: sanitizedCategoria,
          archivo_path: filePath,
          archivo_nombre: sanitizedFilename,
          tamano_bytes: file.size,
          tipo_archivo: file.type,
        });

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      setFile(null);
      setTitulo("");
      setDescripcion("");
      if (!categoriaSeleccionada) setCategoria("");
      toast({
        title: "Archivo subido exitosamente",
        description: "El archivo ha sido agregado a la biblioteca",
      });
    },
    onError: (error) => {
      securityLogger.error("File upload failed", error);
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
              onChange={(e) => {
                const selectedFile = e.target.files?.[0] || null;
                if (selectedFile) {
                  const validation = validateFileUpload(selectedFile);
                  if (!validation.isValid) {
                    toast({
                      title: "Archivo inválido",
                      description: validation.message,
                      variant: "destructive",
                    });
                    e.target.value = '';
                    return;
                  }
                }
                setFile(selectedFile);
              }}
              accept=".zip,.rar,.7z,.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.webp"
            />
          </div>
          
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(sanitizeText(e.target.value))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="categoria">Categoría</Label>
            <Input
              id="categoria"
              value={categoria}
              onChange={(e) => setCategoria(sanitizeText(e.target.value))}
              readOnly={!!categoriaSeleccionada}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(sanitizeText(e.target.value))}
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
