
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TestimonialsList } from "@/components/admin/TestimonialsList";
import { CoursesList } from "@/components/admin/CoursesList";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPendingTestimonials, setShowPendingTestimonials] = useState(false);
  const [localPendingTestimonials, setLocalPendingTestimonials] = useState<any[]>([]);
  
  // Query for pending testimonials count
  const { data: pendingTestimonialsCount = 0, refetch: refetchPendingCount } = useQuery({
    queryKey: ['pending-testimonials-count'],
    queryFn: async () => {
      console.log("Fetching pending testimonials count");
      const { count, error } = await supabase
        .from('pending_testimonials')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Error fetching pending testimonials count:", error);
        throw error;
      }
      console.log("Fetched pending testimonials count:", count);
      return count || 0;
    },
  });

  // Query for pending testimonials data
  const { data: pendingTestimonials, isLoading: isLoadingPending, refetch: refetchPendingTestimonials } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      console.log("Fetching pending testimonials");
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching pending testimonials:", error);
        throw error;
      }
      console.log("Fetched pending testimonials:", data);
      return data;
    },
  });

  // Initialize local state when data is fetched
  useEffect(() => {
    if (pendingTestimonials) {
      setLocalPendingTestimonials(pendingTestimonials);
    }
  }, [pendingTestimonials]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Queries for other data
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['admin-testimonials'],
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
      // First update local state for immediate UI feedback
      setLocalPendingTestimonials(prev => prev.filter(item => item.id !== testimonial.id));
      
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

      // Force refetch to ensure data is fresh
      await Promise.all([
        refetchPendingTestimonials(),
        refetchPendingCount()
      ]);

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });
    } catch (error) {
      console.error("Complete error:", error);
      
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
      // First update local state for immediate UI feedback
      setLocalPendingTestimonials(prev => prev.filter(item => item.id !== id));
      
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

      // Force refetch to ensure data is fresh
      await Promise.all([
        refetchPendingTestimonials(),
        refetchPendingCount()
      ]);

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });
    } catch (error) {
      console.error("Complete error:", error);
      
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

  const handleTogglePendingTestimonials = () => {
    setShowPendingTestimonials(!showPendingTestimonials);
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <AdminHeader 
        pendingTestimonialsCount={pendingTestimonialsCount} 
        onTestimonialsClick={handleTogglePendingTestimonials}
      />

      <div className="grid gap-6">
        {showPendingTestimonials && pendingTestimonialsCount > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Testimonios Pendientes ({pendingTestimonialsCount})</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingPending ? (
                <p>Cargando testimonios pendientes...</p>
              ) : (
                <div className="space-y-4">
                  {localPendingTestimonials?.length > 0 ? (
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
                              size="sm"
                              onClick={() => handleApprove(testimonial)}
                              className="gap-2"
                            >
                              <Check className="h-4 w-4" />
                              Aprobar
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleReject(testimonial.id)}
                              className="gap-2"
                            >
                              <X className="h-4 w-4" />
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
        )}

        <Card>
          <CardHeader>
            <CardTitle>Testimonios</CardTitle>
          </CardHeader>
          <CardContent>
            <TestimonialsList 
              testimonials={testimonials || []} 
              isLoading={isLoadingTestimonials} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <CoursesList 
              courses={courses || []} 
              isLoading={isLoadingCourses} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
