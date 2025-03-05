
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useTestimonialApproval, useTestimonialRejection } from "@/utils/testimonialManager";

interface PendingTestimonialsPanelProps {
  visible: boolean;
  onCountChange?: (count: number) => void;
}

export const PendingTestimonialsPanel = ({ visible, onCountChange }: PendingTestimonialsPanelProps) => {
  const approveTestimonial = useTestimonialApproval();
  const rejectTestimonial = useTestimonialRejection();
  
  // Fetch pending testimonials with no caching and frequent refetching
  const { 
    data: pendingTestimonials = [], 
    isLoading, 
    refetch 
  } = useQuery({
    queryKey: ['pending-testimonials'],
    queryFn: async () => {
      console.log("[Panel] Fetching pending testimonials");
      const { data, error } = await supabase
        .from('pending_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("[Panel] Error fetching testimonials:", error);
        throw error;
      }
      
      // Update count in parent component
      if (onCountChange && data) {
        onCountChange(data.length);
      }
      
      console.log("[Panel] Fetched testimonials:", data?.length || 0);
      return data || [];
    },
    staleTime: 0, // Always consider data stale
    refetchInterval: 3000, // Refetch every 3 seconds
  });

  // Force refresh on visibility change
  useEffect(() => {
    if (visible) {
      refetch();
    }
  }, [visible, refetch]);

  // Handle approval of a testimonial
  const handleApprove = async (testimonial: any) => {
    const success = await approveTestimonial(testimonial);
    if (success) {
      await refetch();
    }
  };

  // Handle rejection of a testimonial
  const handleReject = async (id: string) => {
    const success = await rejectTestimonial(id);
    if (success) {
      await refetch();
    }
  };

  if (!visible) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Testimonios Pendientes ({pendingTestimonials.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Cargando testimonios pendientes...</p>
        ) : (
          <div className="space-y-4">
            {pendingTestimonials.length > 0 ? (
              pendingTestimonials.map((testimonial) => (
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
