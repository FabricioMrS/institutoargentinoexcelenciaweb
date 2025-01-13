import { Monitor, Users, Clock, Award } from "lucide-react";
import { CourseCard } from "@/components/CourseCard";
import { FeatureCard } from "@/components/FeatureCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
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

export const HeroSection = () => {
  return (
    <section className="bg-primary text-primary-foreground py-20">
      <div className="container">
        <div className="text-center">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/83991cd8-6df5-460f-94c7-18ceefafd352.png" 
              alt="Instituto Argentino Excelencia" 
              className="h-64 object-contain mx-auto mb-4"
            />
            <div className="w-full max-w-3xl mx-auto h-px bg-secondary mb-8"></div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Bienvenido a Instituto Argentino Excelencia</h1>
          <p className="text-lg mb-8">Ofrecemos una variedad de cursos para ayudarte a alcanzar tus metas educativas y profesionales.</p>
          <WhatsAppButton floating={true} />
        </div>
      </div>
    </section>
  );
};
