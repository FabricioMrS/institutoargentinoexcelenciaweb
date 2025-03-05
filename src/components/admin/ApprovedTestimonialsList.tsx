
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface ApprovedTestimonialsListProps {
  testimonials: any[];
  isLoading: boolean;
}

export const ApprovedTestimonialsList = ({ testimonials, isLoading }: ApprovedTestimonialsListProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handlePhotoUpload = async (testimonialId: string, file: File) => {
    try {
      console.log(`[Photo] Uploading photo for testimonial ID: ${testimonialId}`);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('teachers_photos')
        .upload(filePath, file);

      if (uploadError) {
        console.error("[Photo] Upload error:", uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('teachers_photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('testimonials')
        .update({ photo_url: publicUrl })
        .eq('id', testimonialId);

      if (updateError) {
        console.error("[Photo] Update error:", updateError);
        throw updateError;
      }

      console.log("[Photo] Successfully updated photo URL:", publicUrl);
      
      // Invalidate queries to refresh data
      await queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Éxito",
        description: "Foto actualizada correctamente",
      });
    } catch (error) {
      console.error('[Photo] Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la foto",
      });
    }
  };

  if (isLoading) return <p>Cargando testimonios...</p>;

  return (
    <div className="space-y-4">
      {testimonials?.length > 0 ? (
        testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="flex items-center justify-between p-4 border rounded-lg"
          >
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={testimonial.photo_url || undefined} alt={testimonial.name} />
                <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
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
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>No hay testimonios aprobados.</p>
      )}
    </div>
  );
};
