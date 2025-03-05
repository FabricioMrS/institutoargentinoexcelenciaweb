
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApproveTestimonial, useRejectTestimonial } from "@/utils/testimonialUtils";

interface PendingTestimonialsProps {
  visible: boolean;
  pendingCount: number;
  onRefetch?: () => void;
}

export const PendingTestimonials = ({ visible, pendingCount, onRefetch }: PendingTestimonialsProps) => {
  const [localPendingTestimonials, setLocalPendingTestimonials] = useState<any[]>([]);
  const approveTestimonial = useApproveTestimonial();
  const rejectTestimonial = useRejectTestimonial();
  const queryClient = useQueryClient();

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
  
  // Force refresh data when component becomes visible
  useEffect(() => {
    if (visible) {
      const refreshData = async () => {
        await refetchPendingTestimonials();
        if (onRefetch) onRefetch();
      };
      
      refreshData();
    }
  }, [visible, refetchPendingTestimonials, onRefetch]);

  const handleApprove = async (testimonial: any) => {
    const success = await approveTestimonial(testimonial, setLocalPendingTestimonials);
    if (success) {
      await refetchPendingTestimonials();
      if (onRefetch) onRefetch();
      
      // Force refresh after a short delay
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ['pending-testimonials'] });
        await queryClient.refetchQueries({ queryKey: ['pending-testimonials-count'] });
      }, 500);
    }
  };

  const handleReject = async (id: string) => {
    const success = await rejectTestimonial(id, setLocalPendingTestimonials);
    if (success) {
      await refetchPendingTestimonials();
      if (onRefetch) onRefetch();
      
      // Force refresh after a short delay
      setTimeout(async () => {
        await queryClient.refetchQueries({ queryKey: ['pending-testimonials'] });
        await queryClient.refetchQueries({ queryKey: ['pending-testimonials-count'] });
      }, 500);
    }
  };

  if (!visible) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Testimonios Pendientes ({pendingCount})</CardTitle>
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
  );
};
