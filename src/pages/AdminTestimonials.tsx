
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
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

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: pendingTestimonials, isLoading: isLoadingPending, refetch: refetchPendingTestimonials } = useQuery({
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
    // Disable cache to always fetch fresh data
    staleTime: 0,
    gcTime: 0,
  });

  // Initialize local state when data is fetched
  useEffect(() => {
    if (pendingTestimonials) {
      setLocalPendingTestimonials(pendingTestimonials);
    }
  }, [pendingTestimonials]);

  // Force refresh on mount
  useEffect(() => {
    refetchPendingTestimonials();
    
    // Set up a refresh interval
    const interval = setInterval(() => {
      refetchPendingTestimonials();
    }, 10000); // Refresh every 10 seconds
    
    return () => clearInterval(interval);
  }, [refetchPendingTestimonials]);

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
    const success = await approveTestimonial(testimonial, setLocalPendingTestimonials);
    if (success) {
      await refetchPendingTestimonials();
    }
  };

  const handleReject = async (id: string) => {
    const success = await rejectTestimonial(id, setLocalPendingTestimonials);
    if (success) {
      await refetchPendingTestimonials();
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
