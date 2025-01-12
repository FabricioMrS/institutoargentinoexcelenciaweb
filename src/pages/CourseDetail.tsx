import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const courses = {
  "ingles-universitario": {
    title: "Inglés Universitario",
    category: "Idiomas",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    price: "94.999 ARS",
    startDate: "15 de Mayo 2024",
    schedule: "18:00 - 20:00 hs",
    modality: "Virtual",
    duration: 3
  },
  "medicina-unc": {
    title: "Cursos de medicina UNC",
    category: "Medicina",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "1 de Junio 2024",
    schedule: "08:00 - 12:00 hs",
    modality: "Presencial",
    duration: 6
  },
  "edicion-videos": {
    title: "Curso de edición de videos",
    category: "Multimedia",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    price: "129.999 ARS",
    startDate: "20 de Mayo 2024",
    schedule: "19:00 - 21:00 hs",
    modality: "Virtual",
    duration: 4
  }
};

const CourseDetail = () => {
  const { courseId } = useParams();
  const course = courses[courseId as keyof typeof courses];

  if (!course) return <div>Curso no encontrado</div>;

  const basePrice = parseInt(course.price.replace(/[^0-9]/g, ''));
  const installments = Array.from({ length: course.duration }, (_, i) => i + 1);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleInstallmentClick = (installments: number) => {
    const monthlyPayment = formatPrice(Math.round(basePrice / installments));
    const message = `Hola! Estoy interesado en el curso ${course.title} y la forma de financiación de ${installments} cuota${installments > 1 ? 's' : ''} de ${monthlyPayment}`;
    window.open(`https://wa.me/543518118268?text=${encodeURIComponent(message)}`, '_blank');
  };

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

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Opciones de financiación:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {installments.map((number) => {
                const monthlyPayment = Math.round(basePrice / number);
                return (
                  <Button
                    key={number}
                    variant="outline"
                    onClick={() => handleInstallmentClick(number)}
                    className="w-full"
                  >
                    {number} cuota{number > 1 ? 's' : ''} de {formatPrice(monthlyPayment)}
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <WhatsAppButton message={`Hola! Estoy interesado en el curso ${course.title}`} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetail;