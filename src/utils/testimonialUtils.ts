
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Helper functions for working with testimonials
export const useApproveTestimonial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return async (testimonial: any, setLocalTestimonials: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // Insert into testimonials table
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert({
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url
        } as any);

      if (insertError) throw insertError;

      // Delete from pending_testimonials table
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id as any);

      if (deleteError) throw deleteError;

      // Update UI state
      setLocalTestimonials((prev) => prev.filter((t) => t.id !== testimonial.id));

      // Show success message
      toast({
        title: "Éxito",
        description: "Testimonio aprobado correctamente",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });

      return true;
    } catch (error) {
      console.error("Error approving testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo aprobar el testimonio",
      });
      return false;
    }
  };
};

export const useRejectTestimonial = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return async (testimonialId: string, setLocalTestimonials: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      // Delete from pending_testimonials table
      const { error } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonialId as any);

      if (error) throw error;

      // Update UI state
      setLocalTestimonials((prev) => prev.filter((t) => t.id !== testimonialId));

      // Show success message
      toast({
        title: "Éxito",
        description: "Testimonio rechazado correctamente",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });

      return true;
    } catch (error) {
      console.error("Error rejecting testimonial:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo rechazar el testimonio",
      });
      return false;
    }
  };
};
