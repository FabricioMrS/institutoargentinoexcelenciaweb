
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsList } from "@/components/admin/TestimonialsList";

const AdminTestimonials = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [localPendingTestimonials, setLocalPendingTestimonials] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: pendingTestimonials, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      console.log("AdminTestimonials: Fetching pending testimonials");
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("AdminTestimonials: Error fetching pending testimonials:", error);
        throw error;
      }
      console.log("AdminTestimonials: Fetched pending testimonials:", data);
      return data;
    },
  });

  // Initialize local state when data is fetched
  useEffect(() => {
    if (pendingTestimonials) {
      setLocalPendingTestimonials(pendingTestimonials);
    }
  }, [pendingTestimonials]);

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleApprove = async (testimonial: any) => {
    try {
      // Remove from local state immediately for UI feedback
      setLocalPendingTestimonials(prev => prev.filter(item => item.id !== testimonial.id));

      console.log(`AdminTestimonials: Approving testimonial with ID: ${testimonial.id}`);
      
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
        console.error("AdminTestimonials: Insert error:", insertError);
        throw insertError;
      }

      console.log("AdminTestimonials: Successfully inserted to testimonials table");

      // Delete from pending testimonials WITH return data to confirm deletion
      const { error: deleteError, data: deleteData } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id)
        .select();

      if (deleteError) {
        console.error("AdminTestimonials: Delete error:", deleteError);
        throw deleteError;
      }

      console.log("AdminTestimonials: Successfully deleted from pending_testimonials table. Deleted data:", deleteData);

      // Invalidate all relevant queries and force refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      ]);

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });
    } catch (error) {
      console.error("AdminTestimonials: Complete error:", error);
      
      // Restore the testimonial in local state if there was an error
      if (pendingTestimonials) {
        setLocalPendingTestimonials(pendingTestimonials);
      }
      
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      // Remove from local state immediately for UI feedback
      setLocalPendingTestimonials(prev => prev.filter(item => item.id !== id));
      
      console.log(`AdminTestimonials: Rejecting testimonial with ID: ${id}`);
      
      // Delete from pending testimonials WITH return data to confirm deletion
      const { error, data: deleteData } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id)
        .select();

      if (error) {
        console.error("AdminTestimonials: Delete error:", error);
        throw error;
      }

      console.log("AdminTestimonials: Successfully deleted from pending_testimonials table. Deleted data:", deleteData);

      // Invalidate all relevant queries and force refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] })
      ]);

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });
    } catch (error) {
      console.error("AdminTestimonials: Complete error:", error);
      
      // Restore the testimonial in local state if there was an error
      if (pendingTestimonials) {
        setLocalPendingTestimonials(pendingTestimonials);
      }
      
      toast({
        title: "Error",
        description: "No se pudo rechazar el testimonio.",
        variant: "destructive",
      });
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Testimonios Pendientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingPending ? (
            <p>Cargando testimonios...</p>
          ) : (
            <div className="space-y-4">
              {localPendingTestimonials.length > 0 ? (
                localPendingTestimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="border rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="default"
                          onClick={() => handleApprove(testimonial)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => handleReject(testimonial.id)}
                        >
                          Rechazar
                        </Button>
                      </div>
                    </div>
                    <p className="italic">{testimonial.content}</p>
                  </div>
                ))
              ) : (
                <p>No hay testimonios pendientes de aprobación.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testimonios Aprobados</CardTitle>
        </CardHeader>
        <CardContent>
          <TestimonialsList 
            testimonials={testimonials || []} 
            isLoading={isLoadingTestimonials} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;
