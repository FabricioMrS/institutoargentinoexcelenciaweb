import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Monitor } from "lucide-react";

const courses = {
  "ingles-universitario": {
    title: "Inglés Universitario",
    category: "Idiomas",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    price: "94.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "18:00 - 20:00 hs",
    modality: "Virtual"
  },
  "medicina-unc": {
    title: "Cursos de medicina UNC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "08:00 - 12:00 hs",
    modality: "Presencial"
  },
  "edicion-videos": {
    title: "Curso de edición de videos",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "20 de Mayo 2024",
    schedule: "19:00 - 21:00 hs",
    modality: "Virtual"
  }
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courses[courseId as keyof typeof courses];

  if (!course) return <div>Curso no encontrado</div>;

  return (
    <div className="container py-12">
      <Card className="max-w-3xl mx-auto">
        <div className="h-64 overflow-hidden">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="secondary">{course.category}</Badge>
            <div className="text-right">
              <span className="font-bold text-2xl block">{course.price}</span>
              <span className="text-sm text-muted-foreground">Financiación disponible</span>
            </div>
          </div>
          <CardTitle className="text-3xl">{course.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="text-primary" />
              <div>
                <p className="font-medium">Inicio</p>
                <p className="text-sm text-muted-foreground">{course.startDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary" />
              <div>
                <p className="font-medium">Horario</p>
                <p className="text-sm text-muted-foreground">{course.schedule}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Monitor className="text-primary" />
              <div>
                <p className="font-medium">Modalidad</p>
                <p className="text-sm text-muted-foreground">{course.modality}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;