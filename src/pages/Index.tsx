
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

const courses = [
  {
    title: "Inglés Universitario",
    category: "Idiomas",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    price: "",
    slug: "ingles-universitario"
  },
  {
    title: "Cursos de medicina UNC - UCC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "medicina-unc"
  },
  {
    title: "Desarrollo Web",
    category: "Programación",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "desarrollo-web"
  },
  {
    title: "Diseño Gráfico",
    category: "Diseño",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "diseno-grafico"
  },
  {
    title: "Marketing Digital",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "marketing-digital"
  },
  {
    title: "Creación y edición audiovisual",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "edicion-videos"
  }
];

const testimonials = [
  {
    name: "María García",
    role: "Estudiante de Medicina",
    content: "Los cursos son excelentes y los profesores muy profesionales. La flexibilidad de horarios me permitió estudiar mientras trabajaba.",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Juan Pérez",
    role: "Estudiante de Inglés",
    content: "La calidad del contenido y el soporte del equipo docente son excepcionales. El formato virtual me permitió organizar mejor mis tiempos.",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ana Martínez",
    role: "Estudiante de Medicina",
    content: "Excelente experiencia de aprendizaje. Los profesores están siempre disponibles para resolver dudas.",
    avatar: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Carlos Rodriguez",
    role: "Estudiante de Medicina UNC",
    content: "La metodología de enseñanza es muy efectiva. Me ayudó mucho en mi preparación académica.",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Laura Sánchez",
    role: "Estudiante de Inglés Universitario",
    content: "Los profesores son excelentes y el material de estudio es muy completo. Totalmente recomendado.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
  }
];

const Index = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
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

  const { data: courses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['enabled-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
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
        .insert([testimonialForm]);

      if (error) throw error;

      toast({
        title: "¡Gracias por tu testimonio!",
        description: "Tu testimonio será revisado por nuestro equipo antes de ser publicado.",
      });
      setIsTestimonialDialogOpen(false);
      setTestimonialForm({ name: "", role: "", content: "" });
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
      {!isLoadingCourses && courses.length > 0 && (
        <section className="py-20 md:block hidden">
          <div className="container">
            <h2 className="text-4xl font-bold text-center mb-12">Cursos Destacados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <CourseCard key={course.id} {...course} />
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
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={testimonialForm.name}
                onChange={(e) => setTestimonialForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
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
