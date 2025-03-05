
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

      // DELETE from pending testimonials - make sure we get confirmation with return
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      // Verify deletion by checking if the record still exists
      const { data: checkData, error: checkError } = await supabase
        .from('pending_testimonials')
        .select()
        .eq('id', testimonial.id);

      if (checkError) {
        console.error("Error verifying deletion:", checkError);
      } else {
        console.log("Verification check - remaining records with this ID:", checkData?.length || 0);
      }

      // Invalidate all related queries, making sure to refetch them
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
      
      // First, check if the record exists
      const { data: existingData, error: existingError } = await supabase
        .from('pending_testimonials')
        .select()
        .eq('id', id);

      if (existingError) {
        console.error("Error checking record existence:", existingError);
        throw existingError;
      }

      console.log("Record exists check:", existingData);
      
      if (!existingData || existingData.length === 0) {
        console.log("Record does not exist, no need to delete");
        return true;
      }
      
      // DELETE from pending testimonials with explicit return
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }
      
      // Verify deletion by checking if the record still exists
      const { data: checkData, error: checkError } = await supabase
        .from('pending_testimonials')
        .select()
        .eq('id', id);

      if (checkError) {
        console.error("Error verifying deletion:", checkError);
      } else {
        console.log("Verification check - remaining records with this ID:", checkData?.length || 0);
      }

      // Force refresh all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] })
      ]);

      // Force refetch
      await queryClient.refetchQueries({ queryKey: ['pending-testimonials'] });
      await queryClient.refetchQueries({ queryKey: ['pending-testimonials-count'] });

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
