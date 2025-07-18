
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useApproveTestimonial = () => {
  return async (testimonial: any, setLocalPendingTestimonials: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      console.log("Approving testimonial with ID:", testimonial.id);
      
      // First insert into approved testimonials table
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url
        });

      if (insertError) {
        console.error('Error inserting testimonial:', insertError);
        throw insertError;
      }

      // Then delete from pending_testimonials
      const { error: deleteError, data: deleteData } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id)
        .select();

      console.log("Delete response after approval:", { deleteError, deleteData });
      
      if (deleteError) {
        console.error('Error deleting pending testimonial:', deleteError);
        throw deleteError;
      }

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
      console.log("Rejecting testimonial with ID:", id);
      
      // Delete directly from pending_testimonials
      const { error, data } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id)
        .select();

      console.log("Delete response after rejection:", { error, data });
      
      if (error) {
        console.error('Error deleting rejected testimonial:', error);
        throw error;
      }

      toast.success("Testimonio rechazado exitosamente");
      return true;
    } catch (error) {
      console.error('Error al rechazar testimonio:', error);
      toast.error("Error al rechazar testimonio");
      return false;
    }
  };
};
