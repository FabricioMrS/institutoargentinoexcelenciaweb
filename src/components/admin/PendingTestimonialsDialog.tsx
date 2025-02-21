
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { useEffect } from "react";

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

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      // Asegurarse de que el diálogo esté cerrado al desmontar
      onOpenChange(false);
    };
  }, [onOpenChange]);

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

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Testimonio aprobado",
        description: "El testimonio ha sido publicado exitosamente.",
      });

      onOpenChange(false);
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

      queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['pending-testimonials-count'] });

      toast({
        title: "Testimonio rechazado",
        description: "El testimonio ha sido eliminado.",
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo rechazar el testimonio.",
        variant: "destructive",
      });
    }
  };

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => onOpenChange(false)}
    >
      <DrawerContent>
        <div className="mx-auto w-full max-w-2xl">
          <DrawerHeader>
            <DrawerTitle>Testimonios Pendientes</DrawerTitle>
            <DrawerDescription>
              Revisa y gestiona los testimonios pendientes de aprobación
            </DrawerDescription>
          </DrawerHeader>
          <div className="p-4">
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
                ))}
                {pendingTestimonials?.length === 0 && (
                  <p>No hay testimonios pendientes de aprobación.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
