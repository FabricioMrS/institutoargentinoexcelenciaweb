import { Monitor, Users, Clock, Award } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const features = [
  {
    title: "Clases Online",
    description: "Accede a tus clases desde cualquier lugar y a cualquier hora",
    Icon: Monitor,
  },
  {
    title: "Profesores Expertos",
    description: "Aprende de profesionales con amplia experiencia en la industria",
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
    price: "94.999 ARS",
    slug: "ingles-universitario"
  },
  {
    title: "Cursos de medicina UNC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "medicina-unc"
  },
  {
    title: "Curso de edición de videos",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    slug: "edicion-videos"
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
];

const testimonials = [
  {
    name: "María García",
    role: "Estudiante de Marketing Digital",
    content: "Los cursos son excelentes y los profesores muy profesionales. La flexibilidad de horarios me permitió estudiar mientras trabajaba. Recomiendo totalmente la experiencia.",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Juan Pérez",
    role: "Desarrollador Web",
    content: "La calidad del contenido y el soporte del equipo docente son excepcionales. El formato virtual me permitió organizar mejor mis tiempos.",
    avatar: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ana Martínez",
    role: "Diseñadora UX",
    content: "Excelente experiencia de aprendizaje. Los profesores están siempre disponibles para resolver dudas y el material es muy completo.",
    avatar: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      
      {/* Características */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">¿Por qué elegir {" "}
            <span className="text-primary">Instituto Argentino Excelencia</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Cursos Destacados */}
      <section className="py-20">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Cursos Destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard key={course.title} {...course} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <h2 className="text-4xl font-bold text-center mb-12">Lo que dicen nuestros estudiantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.name} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Index;
