
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

// Handle approving a testimonial
export const useTestimonialApproval = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const approveTestimonial = async (testimonial: any) => {
    try {
      console.log(`[Approval] Starting approval for testimonial ID: ${testimonial.id}`);
      
      // First insert into approved testimonials
      const { data: insertedItem, error: insertError } = await supabase
        .from('testimonials')
        .insert([{
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url || null,
        }]);

      if (insertError) {
        console.error("[Approval] Insert error:", insertError);
        throw new Error(`Failed to insert testimonial: ${insertError.message}`);
      }

      console.log("[Approval] Successfully inserted to testimonials table");

      // Then delete from pending testimonials
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (deleteError) {
        console.error("[Approval] Delete error:", deleteError);
        throw new Error(`Failed to delete pending testimonial: ${deleteError.message}`);
      }

      console.log("[Approval] Deleted from pending testimonials");
      
      // Force refresh all queries to ensure UI updates
      queryClient.invalidateQueries();
      
      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });
      
      return true;
    } catch (error) {
      console.error("[Approval] Error:", error);
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio. Intente nuevamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return approveTestimonial;
};

// Handle rejecting a testimonial
export const useTestimonialRejection = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const rejectTestimonial = async (id: string) => {
    try {
      console.log(`[Rejection] Starting rejection for testimonial ID: ${id}`);
      
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error("[Rejection] Delete error:", deleteError);
        throw new Error(`Failed to delete pending testimonial: ${deleteError.message}`);
      }

      console.log("[Rejection] Successfully deleted testimonial");
      
      // Force refresh all queries to ensure UI updates
      queryClient.invalidateQueries();

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });
      
      return true;
    } catch (error) {
      console.error("[Rejection] Error:", error);
      toast({
        title: "Error",
        description: "No se pudo rechazar el testimonio. Intente nuevamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return rejectTestimonial;
};

// Get pending testimonials count
export const usePendingTestimonialsCount = () => {
  const fetchPendingCount = async () => {
    console.log("[Count] Fetching pending testimonials count");
    const { count, error } = await supabase
      .from('pending_testimonials')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error("[Count] Error fetching count:", error);
      throw new Error(`Failed to fetch count: ${error.message}`);
    }
    
    console.log("[Count] Fetched count:", count);
    return count || 0;
  };

  return fetchPendingCount;
};

// Handle deleting an approved testimonial
export const useTestimonialDeletion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteTestimonial = async (id: string) => {
    try {
      console.log(`[Deletion] Starting deletion for testimonial ID: ${id}`);
      
      const { error: deleteError } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error("[Deletion] Delete error:", deleteError);
        throw new Error(`Failed to delete testimonial: ${deleteError.message}`);
      }

      console.log("[Deletion] Successfully deleted testimonial");
      
      // Force refresh all queries
      queryClient.invalidateQueries();

      toast({
        title: "Testimonio eliminado",
        description: "El testimonio ha sido eliminado permanentemente.",
      });
      
      return true;
    } catch (error) {
      console.error("[Deletion] Error:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el testimonio. Intente nuevamente.",
        variant: "destructive",
      });
      return false;
    }
  };

  return deleteTestimonial;
};
