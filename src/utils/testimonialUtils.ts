
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useApproveTestimonial = () => {
  return async (testimonial: any, setLocalPendingTestimonials: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // First insert into approved testimonials table
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url
        });

      if (insertError) throw insertError;

      // Then delete from pending_testimonials
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (deleteError) throw deleteError;

      // Update local state
      setLocalPendingTestimonials((prev: any[]) => 
        prev.filter(t => t.id !== testimonial.id)
      );

      toast.success("Testimonio aprobado exitosamente");
      return true;
    } catch (error) {
      console.error('Error al aprobar testimonio:', error);
      toast.error("Error al aprobar testimonio");
      return false;
    }
  };
};

export const useRejectTestimonial = () => {
  return async (id: string, setLocalPendingTestimonials: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // Delete directly from pending_testimonials
      const { error } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state
      setLocalPendingTestimonials((prev: any[]) => 
        prev.filter(t => t.id !== id)
      );

      toast.success("Testimonio rechazado exitosamente");
      return true;
    } catch (error) {
      console.error('Error al rechazar testimonio:', error);
      toast.error("Error al rechazar testimonio");
      return false;
    }
  };
};
