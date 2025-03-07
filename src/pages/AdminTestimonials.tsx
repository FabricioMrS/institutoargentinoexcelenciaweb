
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestimonialsList } from "@/components/admin/TestimonialsList";
import { useApproveTestimonial, useRejectTestimonial } from "@/utils/testimonialUtils";
import { Button } from "@/components/ui/button";

const AdminTestimonials = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [localPendingTestimonials, setLocalPendingTestimonials] = useState<any[]>([]);
  const approveTestimonial = useApproveTestimonial();
  const rejectTestimonial = useRejectTestimonial();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: pendingTestimonials, isLoading: isLoadingPending, refetch } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      console.log("Fetching pending testimonials from AdminTestimonials");
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching pending testimonials:", error);
        throw error;
      }
      console.log("Fetched pending testimonials:", data);
      return data || [];
    },
    staleTime: 0, // Always fetch fresh data
    gcTime: 0,    // Don't cache
  });

  // Initialize local state when data is fetched
  useEffect(() => {
    if (pendingTestimonials) {
      console.log("Updating local state with pending testimonials:", pendingTestimonials);
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
      return data || [];
    },
  });

  const handleApprove = async (testimonial: any) => {
    console.log("Starting approval process for testimonial:", testimonial.id);
    const success = await approveTestimonial(testimonial, setLocalPendingTestimonials);
    if (success) {
      console.log("Testimonial approved successfully, refreshing data");
      // Force immediate refresh of all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] })
      ]);
      
      // Explicitly refetch to update the UI immediately
      await refetch();
    }
  };

  const handleReject = async (id: string) => {
    console.log("Starting rejection process for testimonial:", id);
    const success = await rejectTestimonial(id, setLocalPendingTestimonials);
    if (success) {
      console.log("Testimonial rejected successfully, refreshing data");
      // Force immediate refresh of all related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] }),
        queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] })
      ]);
      
      // Explicitly refetch to update the UI immediately
      await refetch();
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
