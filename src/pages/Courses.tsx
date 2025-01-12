import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const courses = [
  {
    title: "Inglés Universitario",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    slug: "ingles-universitario"
  },
  {
    title: "Cursos de medicina UNC",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    slug: "medicina-unc"
  },
  {
    title: "Curso de edición de videos",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    slug: "edicion-videos"
  },
  {
    title: "Desarrollo Web",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    slug: "desarrollo-web"
  },
  {
    title: "Diseño Gráfico",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    slug: "diseno-grafico"
  },
  {
    title: "Marketing Digital",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    slug: "marketing-digital"
  }
];

const Courses = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card 
            key={course.slug}
            className="cursor-pointer overflow-hidden transition-transform hover:scale-105"
            onClick={() => navigate(`/curso/${course.slug}`)}
          >
            <div className="h-48 overflow-hidden">
              <img 
                src={course.image} 
                alt={course.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{course.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Courses;
