import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WhatsAppButton } from "@/components/WhatsAppButton";

interface CourseDetails {
  title: string;
  category: string;
  image: string;
  price: string;
  startDate: string;
  schedule: string;
  description: string;
  duration: number;
}

const courseDetails: Record<string, CourseDetails> = {
  "ingles-universitario": {
    title: "Inglés Universitario",
    category: "Idiomas",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    price: "94.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "Martes y Jueves 18:00-20:00",
    description: "Curso de inglés orientado a estudiantes universitarios, con enfoque en vocabulario técnico y académico.",
    duration: 3
  },
  "medicina-unc": {
    title: "Cursos de medicina UNC - UCC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "Lunes y Miércoles 19:00-21:00",
    description: "Cursos de medicina con enfoque práctico y teórico, dictados por profesionales del área.",
    duration: 4
  },
  "desarrollo-web": {
    title: "Desarrollo Web",
    category: "Programación",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "10 de Mayo 2024",
    schedule: "Martes y Jueves 18:00-20:00",
    description: "Aprende a crear sitios web desde cero, utilizando HTML, CSS y JavaScript.",
    duration: 3
  },
  "diseno-grafico": {
    title: "Diseño Gráfico",
    category: "Diseño",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "Lunes y Miércoles 19:00-21:00",
    description: "Curso de diseño gráfico que abarca herramientas y técnicas para la creación visual.",
    duration: 3
  },
  "marketing-digital": {
    title: "Marketing Digital",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "Martes y Jueves 18:00-20:00",
    description: "Aprende estrategias de marketing digital para potenciar tu negocio en línea.",
    duration: 3
  },
  "edicion-videos": {
    title: "Creación y edición audiovisual",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "10 de Mayo 2024",
    schedule: "Miércoles y Viernes 17:00-19:00",
    description: "Curso de edición de video que te enseñará a crear contenido audiovisual atractivo.",
    duration: 2
  },
  "intro-programacion": {
    title: "Introducción a la programación",
    category: "Programación",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80",
    price: "94.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "Martes y Jueves 18:00-20:00",
    description: "Curso introductorio al mundo de la programación. Aprenderás los fundamentos de la lógica de programación y los conceptos básicos de desarrollo de software.",
    duration: 3
  },
  "ingles-viajeros": {
    title: "Inglés para viajeros",
    category: "Idiomas",
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80",
    price: "79.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "Lunes y Miércoles 19:00-21:00",
    description: "Curso práctico de inglés enfocado en situaciones de viaje. Aprenderás vocabulario y expresiones útiles para desenvolverte en el extranjero.",
    duration: 2
  },
  "nutricion-deportiva": {
    title: "Nutrición y suplementación deportiva",
    category: "Salud",
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    price: "89.999 ARS",
    startDate: "10 de Mayo 2024",
    schedule: "Miércoles y Viernes 17:00-19:00",
    description: "Aprende sobre nutrición deportiva y suplementación para optimizar tu rendimiento físico y alcanzar tus objetivos deportivos.",
    duration: 2
  }
};

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const course = courseDetails[courseId!];

  if (!course) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <div className="container py-12">
      <Card>
        <img src={course.image} alt={course.title} className="w-full h-64 object-cover" />
        <CardHeader>
          <CardTitle className="text-2xl">{course.title}</CardTitle>
          <CardDescription>{course.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Categoría:</strong> {course.category}</p>
          <p><strong>Precio:</strong> {course.price}</p>
          <p><strong>Fecha de inicio:</strong> {course.startDate}</p>
          <p><strong>Horario:</strong> {course.schedule}</p>
          <p><strong>Duración:</strong> {course.duration} semanas</p>
        </CardContent>
      </Card>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default CourseDetail;
