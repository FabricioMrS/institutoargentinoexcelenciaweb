
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Handle approving a testimonial
export const useApproveTestimonial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveTestimonial = async (testimonial: any, setLocalPendingTestimonials?: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // Update local state if provided
      if (setLocalPendingTestimonials) {
        setLocalPendingTestimonials(prev => prev.filter(item => item.id !== testimonial.id));
      }
      
      console.log(`Approving testimonial with ID: ${testimonial.id}`);
      
      // Insert into public testimonials
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert([{
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url,
        }]);

      if (insertError) {
        console.error("Insert error:", insertError);
        throw insertError;
      }

      console.log("Successfully inserted to testimonials table");

      // DELETE from pending testimonials
      const { error: deleteError, data: deleteData } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id)
        .select();

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      console.log("Successfully deleted from pending_testimonials table. Deleted data:", deleteData);

      // Invalidate all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['testimonials'] })
      ]);

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });

      return true;
    } catch (error) {
      console.error("Complete error:", error);
      
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio.",
        variant: "destructive",
      });

      return false;
    }
  };

  return approveTestimonial;
};

// Handle rejecting a testimonial
export const useRejectTestimonial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rejectTestimonial = async (id: string, setLocalPendingTestimonials?: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // Update local state if provided
      if (setLocalPendingTestimonials) {
        setLocalPendingTestimonials(prev => prev.filter(item => item.id !== id));
      }
      
      console.log(`Rejecting testimonial with ID: ${id}`);
      
      // DELETE from pending testimonials
      const { error: deleteError, data: deleteData } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id)
        .select();

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      console.log("Successfully deleted from pending_testimonials table. Deleted data:", deleteData);

      // Invalidate all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] })
      ]);

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });

      return true;
    } catch (error) {
      console.error("Complete error:", error);
      
      toast({
        title: "Error",
        description: "No se pudo rechazar el testimonio.",
        variant: "destructive",
      });

      return false;
    }
  };

  return rejectTestimonial;
};
