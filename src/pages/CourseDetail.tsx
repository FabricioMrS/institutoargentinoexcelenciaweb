import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Checkbox } from "@/components/ui/checkbox";

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

  const calculateInstallments = (price: string) => {
    const numericPrice = Number(price.replace(/[^0-9]/g, ''));
    const installmentOptions = [
      { months: 1, interest: 0 },
      { months: 3, interest: 0.15 },
      { months: 6, interest: 0.30 },
    ];

    return installmentOptions.map(option => {
      const totalAmount = numericPrice * (1 + option.interest);
      const monthlyAmount = totalAmount / option.months;
      return {
        months: option.months,
        monthlyAmount: monthlyAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    });
  };

  const handleInstallmentChange = (months: number, price: string) => {
    setSelectedInstallments(months);
    const installments = calculateInstallments(price);
    const selected = installments.find(i => i.months === months);
    
    if (selected) {
      toast.success(
        `Has seleccionado ${months} cuota${months > 1 ? 's' : ''} de $${selected.monthlyAmount} para el curso "${course.title}"`
      );
    }
  };

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
                      <div>
                        <h3 className="font-semibold mb-1">Precio</h3>
                        <p>${Number(subcourse.price).toLocaleString()}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Inicio</h3>
                        <p>{subcourse.startDate}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Horario</h3>
                        <p>{subcourse.schedule}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Modalidad</h3>
                        <p>{subcourse.modality}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Duración</h3>
                        <p>{subcourse.duration} meses</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="font-semibold mb-2">Opciones de financiación</h3>
                      <div className="flex gap-2">
                        {calculateInstallments(subcourse.price).map(({ months, monthlyAmount }) => (
                          <Button
                            key={months}
                            variant={selectedInstallments === months ? "default" : "outline"}
                            onClick={() => handleInstallmentChange(months, subcourse.price)}
                          >
                            {months} {months === 1 ? 'pago' : 'cuotas'}
                          </Button>
                        ))}
                      </div>
                      {selectedInstallments > 0 && (
                        <div className="mt-4 flex items-center space-x-2">
                          <Checkbox
                            id="whatsapp"
                            checked={sendViaWhatsApp}
                            onCheckedChange={(checked) => setSendViaWhatsApp(checked as boolean)}
                          />
                          <label
                            htmlFor="whatsapp"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Enviar vía WhatsApp
                          </label>
                        </div>
                      )}
                      {sendViaWhatsApp && (
                        <div className="mt-4">
                          <WhatsAppButton 
                            courseTitle={subcourse.title}
                            selectedInstallments={selectedInstallments}
                            price={subcourse.price}
                          />
                        </div>
                      )}
                    </div>
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
                  <div>
                    <h3 className="font-semibold mb-1">Precio</h3>
                    <p>{course.price}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Inicio</h3>
                    <p>{course.startDate}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Horario</h3>
                    <p>{course.schedule}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Modalidad</h3>
                    <p>{course.modality}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Duración</h3>
                    <p>{course.duration} meses</p>
                  </div>
                </div>
                {course.price && (
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2">Opciones de financiación</h3>
                    <div className="flex gap-2">
                      {calculateInstallments(course.price).map(({ months, monthlyAmount }) => (
                        <Button
                          key={months}
                          variant={selectedInstallments === months ? "default" : "outline"}
                          onClick={() => handleInstallmentChange(months, course.price!)}
                        >
                          {months} {months === 1 ? 'pago' : 'cuotas'}
                        </Button>
                      ))}
                    </div>
                    {selectedInstallments > 0 && (
                      <div className="mt-4 flex items-center space-x-2">
                        <Checkbox
                          id="whatsapp"
                          checked={sendViaWhatsApp}
                          onCheckedChange={(checked) => setSendViaWhatsApp(checked as boolean)}
                        />
                        <label
                          htmlFor="whatsapp"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enviar vía WhatsApp
                        </label>
                      </div>
                    )}
                    {sendViaWhatsApp && (
                      <div className="mt-4">
                        <WhatsAppButton 
                          courseTitle={course.title}
                          selectedInstallments={selectedInstallments}
                          price={course.price}
                        />
                      </div>
                    )}
                  </div>
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
