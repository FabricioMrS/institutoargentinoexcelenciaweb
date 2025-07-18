
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload, Trash2 } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface TestimonialsListProps {
  testimonials: any[];
  isLoading: boolean;
}

export const TestimonialsList = ({ testimonials, isLoading }: TestimonialsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePhotoUpload = async (testimonialId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('teachers_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('teachers_photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('testimonials')
        .update({ photo_url: publicUrl })
        .eq('id', testimonialId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Éxito",
        description: "Foto actualizada correctamente",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la foto",
      });
    }
  };

  const handleDeleteTestimonial = async (testimonialId: string, testimonialName: string) => {
    try {
      console.log("Deleting testimonial with ID:", testimonialId);
      
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', testimonialId);

      if (error) {
        console.error('Error deleting testimonial:', error);
        throw error;
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Éxito",
        description: `Testimonio de ${testimonialName} eliminado correctamente`,
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el testimonio",
      });
    }
  };

  if (isLoading) return <p>Cargando testimonios...</p>;

  return (
    <div className="space-y-4">
      {testimonials?.map((testimonial) => (
        <div
          key={testimonial.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center gap-4 flex-1">
            <Avatar>
              <AvatarImage src={testimonial.photo_url || undefined} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium">{testimonial.name}</h3>
              <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 italic">"{testimonial.content}"</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              id={`photo-${testimonial.id}`}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handlePhotoUpload(testimonial.id, file);
                }
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                document.getElementById(`photo-${testimonial.id}`)?.click();
              }}
              title="Subir foto"
            >
              <Upload className="h-4 w-4" />
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="icon"
                  title="Eliminar testimonio"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. El testimonio de {testimonial.name} será eliminado permanentemente y ya no aparecerá en el sitio web.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDeleteTestimonial(testimonial.id, testimonial.name)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Eliminar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
};
