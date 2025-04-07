
import { Monitor, Users, Clock, Award } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const features = [
  {
    title: "Clases Online",
    description: "Accede a tus clases desde cualquier lugar y a cualquier hora",
    Icon: Monitor,
  },
  {
    title: "Profesores Expertos",
    description: "Aprende de profesionales con amplia experiencia en educación",
    Icon: Users,
  },
  {
    title: "Flexibilidad Horaria",
    description: "Estudia a tu propio ritmo y según tu disponibilidad",
    Icon: Clock,
  },
  {
    title: "Certificación",
    description: "Obtén certificados reconocidos al completar los cursos",
    Icon: Award,
  },
];

const Index = () => {
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
      return data;
    },
  });

  const { data: featuredCourses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
        .eq('featured', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const handleTestimonialSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para enviar un testimonio",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('pending_testimonials')
        .insert([{
          ...testimonialForm,
          name: user.email?.split('@')[0] || 'Usuario', // Usamos la parte del email antes del @
        }]);

      if (error) throw error;

      toast({
        title: "¡Gracias por tu testimonio!",
        description: "Tu testimonio será revisado por nuestro equipo antes de ser publicado.",
      });
      setIsTestimonialDialogOpen(false);
      setTestimonialForm({ role: "", content: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo enviar el testimonio. Por favor, intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Características */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary dark:text-white">¿Por qué elegir {" "}
            <span className="text-primary dark:text-secondary">Instituto Argentino Excelencia</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      {!isLoadingCourses && featuredCourses.length > 0 && (
        <section className="py-20">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Cursos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCourses.map((course) => (
                <CourseCard 
                  key={course.id}
                  title={course.title}
                  category={course.category}
                  main_category={course.main_category}
                  image={course.image}
                  price={course.price.toString()}
                  slug={course.slug}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Testimonios */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold">Lo que dicen nuestros estudiantes</h2>
            <Button onClick={() => setIsTestimonialDialogOpen(true)}>
              Compartir mi experiencia
            </Button>
          </div>
          
          {!isLoadingTestimonials && testimonials.length > 0 && (
            <Carousel className="w-full max-w-6xl mx-auto" opts={{ loop: true, align: "start", duration: 20, slidesToScroll: 3 }}>
              <CarouselContent>
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="md:basis-1/3 lg:basis-1/3">
                    <TestimonialCard {...testimonial} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          )}
        </div>
      </section>

      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Comparte tu experiencia</DialogTitle>
            <DialogDescription>
              Tu testimonio será revisado por nuestro equipo antes de ser publicado.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="role">Rol o curso realizado</Label>
              <Input
                id="role"
                value={testimonialForm.role}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, role: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="content">Tu experiencia</Label>
              <Textarea
                id="content"
                value={testimonialForm.content}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
              />
            </div>
            <Button onClick={handleTestimonialSubmit} className="w-full">
              Enviar testimonio
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Index;
