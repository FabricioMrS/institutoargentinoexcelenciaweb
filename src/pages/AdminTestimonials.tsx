
import { useEffect } from "react";
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

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: pendingTestimonials, isLoading: isLoadingPending } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
      // Insert into public testimonials
      const { error: insertError } = await supabase
        .from('testimonials')
        .insert([{
          name: testimonial.name,
          role: testimonial.role,
          content: testimonial.content,
          photo_url: testimonial.photo_url,
        }]);

      if (insertError) throw insertError;

      // Delete from pending testimonials
      const { error: deleteError } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', testimonial.id);

      if (deleteError) throw deleteError;

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });
    } catch (error) {
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
              {pendingTestimonials?.map((testimonial) => (
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
              ))}
              {pendingTestimonials?.length === 0 && (
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
