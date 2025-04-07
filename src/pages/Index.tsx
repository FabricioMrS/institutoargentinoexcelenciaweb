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

// Define interfaces to avoid deeply nested type inference
interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  photo_url?: string;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
  category: string;
  main_category: string | null;
  image: string;
  price: number;
  slug: string;
  featured: boolean | null;
}

const features = [
  {
    Icon: Monitor,
    title: "Clases Online en Vivo",
    description: "Participa en clases interactivas desde cualquier lugar.",
  },
  {
    Icon: Users,
    title: "Comunidad de Aprendizaje",
    description: "Conecta con estudiantes y profesionales del sector.",
  },
  {
    Icon: Clock,
    title: "Flexibilidad Horaria",
    description: "Adapta tu aprendizaje a tu ritmo de vida.",
  },
  {
    Icon: Award,
    title: "Certificación Oficial",
    description: "Obtén un certificado reconocido al finalizar el curso.",
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
      return data as Testimonial[];
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
      return data as Course[];
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
      <HeroSection />

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            Nuestros Cursos Destacados
          </h2>
          {isLoadingCourses ? (
            <p className="text-center">Cargando cursos...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          )}
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                Icon={feature.Icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
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
              <p className="text-gray-600">
                Inicia sesión para dejar tu testimonio.
              </p>
            )}
          </div>
        </div>
      </section>

      <Footer />

      <WhatsAppButton floating={true} />

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

export default Index;
