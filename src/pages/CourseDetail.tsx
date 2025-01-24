import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { CourseInfo } from "@/components/CourseInfo";
import { CourseFinancing } from "@/components/CourseFinancing";

interface Subcourse {
  id: string;
  title: string;
  price: string;
  startDate: string;
  schedule: string;
  modality: string;
  duration: number;
}

interface Course {
  title: string;
  category: string;
  image: string;
  subcourses?: Subcourse[];
  price?: string;
  startDate?: string;
  schedule?: string;
  modality?: string;
  duration?: number;
}

const courses: Record<string, Course> = {
  "ingles-universitario": {
    title: "Inglés Universitario",
    category: "Idiomas",
    image: "/placeholder.svg",
    subcourses: [
      {
        id: "medico",
        title: "Inglés médico, niveles I, II y III",
        price: "120000",
        startDate: "Abril 2024",
        schedule: "Martes y Jueves 18:00-20:00",
        modality: "Virtual",
        duration: 6,
      },
      {
        id: "general",
        title: "Inglés universitario general",
        price: "80000",
        startDate: "Marzo 2024",
        schedule: "Lunes y Miércoles 18:00-20:00",
        modality: "Virtual",
        duration: 4,
      },
    ],
  },
  "curso-2": {
    title: "Curso 2",
    category: "Categoría 2",
    image: "/placeholder.svg",
    price: "50000",
    startDate: "Marzo 2024",
    schedule: "Lunes y Miércoles 18:00-20:00",
    modality: "Virtual",
    duration: 3,
  },
  "medicina-unc": {
    title: "Cursos de medicina UNC - UCC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "A convenir",
    modality: "Virtual",
    duration: 2
  },
  "edicion-videos": {
    title: "Creación y edición audiovisual",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "20 de Mayo 2024",
    schedule: "A convenir",
    modality: "Virtual",
    duration: 4
  },
  "desarrollo-web": {
    title: "Desarrollo Web",
    category: "Programación",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "A convenir",
    modality: "Virtual",
    duration: 4
  },
  "diseno-grafico": {
    title: "Diseño Gráfico",
    category: "Diseño",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "A convenir",
    modality: "Virtual",
    duration: 3
  },
  "marketing-digital": {
    title: "Marketing Digital",
    category: "Marketing",
    image: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "A convenir",
    modality: "Virtual",
    duration: 3
  }
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courseId ? courses[courseId] : null;
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(false);

  if (!course) {
    return <div>Curso no encontrado</div>;
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.category}</p>
        </div>

        {course.subcourses ? (
          <div className="space-y-8">
            {course.subcourses.map((subcourse) => (
              <Card key={subcourse.id}>
                <CardHeader>
                  <CardTitle>{subcourse.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <CourseInfo label="Precio" value={`$${Number(subcourse.price).toLocaleString()}`} />
                      <CourseInfo label="Inicio" value={subcourse.startDate} />
                      <CourseInfo label="Horario" value={subcourse.schedule} />
                      <CourseInfo label="Modalidad" value={subcourse.modality} />
                      <CourseInfo label="Duración" value={`${subcourse.duration} meses`} />
                    </div>
                    <CourseFinancing
                      courseTitle={subcourse.title}
                      price={subcourse.price}
                      selectedInstallments={selectedInstallments}
                      setSelectedInstallments={setSelectedInstallments}
                      sendViaWhatsApp={sendViaWhatsApp}
                      setSendViaWhatsApp={setSendViaWhatsApp}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <CourseInfo label="Precio" value={course.price || ''} />
                  <CourseInfo label="Inicio" value={course.startDate || ''} />
                  <CourseInfo label="Horario" value={course.schedule || ''} />
                  <CourseInfo label="Modalidad" value={course.modality || ''} />
                  <CourseInfo label="Duración" value={`${course.duration || 0} meses`} />
                </div>
                {course.price && (
                  <CourseFinancing
                    courseTitle={course.title}
                    price={course.price}
                    selectedInstallments={selectedInstallments}
                    setSelectedInstallments={setSelectedInstallments}
                    sendViaWhatsApp={sendViaWhatsApp}
                    setSendViaWhatsApp={setSendViaWhatsApp}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
