
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  photo_url?: string;
  created_at: string;
}

export const TestimonialsSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    role: "",
    content: "",
  });

  const { data: testimonials = [], isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Testimonial[];
    },
  });

  const handleTestimonialSubmit = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Debes iniciar sesión para dejar un testimonio.",
      });
      return;
    }

    if (!testimonialForm.role || !testimonialForm.content) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Por favor, completa todos los campos.",
      });
      return;
    }

    const { error } = await supabase
      .from('pending_testimonials')
      .insert({
        name: user.user_metadata.full_name,
        role: testimonialForm.role,
        content: testimonialForm.content,
        photo_url: user.user_metadata.avatar_url,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al enviar tu testimonio. Por favor, intenta de nuevo.",
      });
      console.error("Error submitting testimonial:", error);
    } else {
      toast({
        title: "¡Gracias!",
        description: "Tu testimonio ha sido enviado para su aprobación.",
      });
      setIsTestimonialDialogOpen(false);
      setTestimonialForm({ role: "", content: "" });
    }
  };

  return (
    <>
      <section className="py-12 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
            Testimonios
          </h2>
          {isLoadingTestimonials ? (
            <p className="text-center">Cargando testimonios...</p>
          ) : testimonials.length > 0 ? (
            <Carousel className="w-full max-w-2xl mx-auto">
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id}>
                    <TestimonialCard
                      name={testimonial.name}
                      role={testimonial.role}
                      content={testimonial.content}
                      photo_url={testimonial.photo_url}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          ) : (
            <p className="text-center">Aún no hay testimonios disponibles.</p>
          )}

          <div className="text-center mt-8">
            {user ? (
              <Button onClick={() => setIsTestimonialDialogOpen(true)}>
                Dejar un Testimonio
              </Button>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Inicia sesión para dejar tu testimonio.
              </p>
            )}
          </div>
        </div>
      </section>

      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dejar un Testimonio</DialogTitle>
            <DialogDescription>
              Comparte tu experiencia con nuestros cursos.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Rol:
              </Label>
              <Input
                id="role"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Testimonio:
              </Label>
              <Textarea
                id="content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <Button onClick={handleTestimonialSubmit}>Enviar Testimonio</Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
