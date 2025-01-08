import { Monitor, Users, Clock, Award } from "lucide-react";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Footer } from "@/components/Footer";

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
    price: "89.999 ARS",
  },
  {
    title: "Cursos de medicina UNC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "75.999 ARS",
  },
  {
    title: "Curso de edición de videos",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    price: "79.999 ARS",
  },
];

const testimonials = [
  {
    name: "María García",
    role: "Estudiante de Marketing Digital",
    content: "Los cursos son excelentes y los profesores muy profesionales. He aprendido muchísimo.",
    avatar: "/placeholder.svg",
  },
  {
    name: "Juan Pérez",
    role: "Desarrollador Web",
    content: "La flexibilidad de las clases online me permitió estudiar mientras trabajaba.",
    avatar: "/placeholder.svg",
  },
  {
    name: "Ana Martínez",
    role: "Diseñadora UX",
    content: "La calidad del contenido y el soporte del equipo docente son excepcionales.",
    avatar: "/placeholder.svg",
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
    </div>
  );
};

export default Index;