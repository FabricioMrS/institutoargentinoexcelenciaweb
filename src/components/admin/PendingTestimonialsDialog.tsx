
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useState, useCallback } from "react";

interface PendingTestimonialsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PendingTestimonialsDialog = ({
  open,
  onOpenChange,
}: PendingTestimonialsDialogProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClose = useCallback(() => {
    if (!isProcessing) {
      onOpenChange(false);
    }
  }, [isProcessing, onOpenChange]);

  const { data: pendingTestimonials, isLoading } = useQuery({
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

  const handleApprove = async (testimonial: any) => {
    try {
      setIsProcessing(true);
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

      // Actualizar el cache local inmediatamente
      queryClient.setQueryData(['pending-testimonials'], (old: any[]) => 
        old ? old.filter(t => t.id !== testimonial.id) : []
      );

      // Actualizar el contador
      queryClient.setQueryData(['pending-testimonials-count'], (old: number) => 
        Math.max(0, (old || 0) - 1)
      );

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });

      // Refrescar datos en segundo plano
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo aprobar el testimonio.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      const { error } = await supabase
        .from('pending_testimonials')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Actualizar el cache local inmediatamente
      queryClient.setQueryData(['pending-testimonials'], (old: any[]) => 
        old ? old.filter(t => t.id !== id) : []
      );

      // Actualizar el contador
      queryClient.setQueryData(['pending-testimonials-count'], (old: number) => 
        Math.max(0, (old || 0) - 1)
      );

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
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose} modal={true}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Testimonios Pendientes</DialogTitle>
          <DialogDescription>
            Revisa y gestiona los testimonios pendientes de aprobación
          </DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <p>Cargando testimonios...</p>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
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
                      size="sm"
                      onClick={() => handleApprove(testimonial)}
                      className="gap-2"
                      disabled={isProcessing}
                    >
                      <Check className="h-4 w-4" />
                      Aprobar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleReject(testimonial.id)}
                      className="gap-2"
                      disabled={isProcessing}
                    >
                      <X className="h-4 w-4" />
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
      </DialogContent>
    </Dialog>
  );
};
