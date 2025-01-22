import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Professional {
  id: number;
  name: string;
  role: string;
  specialties: string[];
  image: string;
  description: string;
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Dra. María González",
    role: "Profesora de Medicina",
    specialties: ["Anatomía", "Fisiología", "Biología Celular"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    description: "Especialista en enseñanza de ciencias médicas básicas con más de 15 años de experiencia."
  },
  {
    id: 2,
    name: "Dr. Carlos Rodríguez",
    role: "Profesor de Medicina",
    specialties: ["Patología", "Histología", "Embriología"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    description: "Doctor en Medicina con especialización en patología y amplia experiencia en docencia universitaria."
  },
  {
    id: 3,
    name: "Prof. Laura Martínez",
    role: "Profesora de Inglés",
    specialties: ["Inglés Médico", "Conversación", "Gramática Avanzada"],
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=80",
    description: "Especialista en enseñanza de inglés médico y preparación para exámenes internacionales."
  },
  {
    id: 4,
    name: "Dr. Juan Pérez",
    role: "Profesor de Medicina",
    specialties: ["Farmacología", "Bioquímica", "Fisiología"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80",
    description: "Docente universitario con amplia experiencia en la enseñanza de farmacología y bioquímica."
  }
];

const Professionals = () => {
  const navigate = useNavigate();

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Profesionales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map((professional) => (
          <Card key={professional.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={professional.image} alt={professional.name} />
                <AvatarFallback>{professional.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{professional.name}</h3>
                <p className="text-muted-foreground">{professional.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{professional.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/profesional/${professional.id}`)}
              >
                Ver Perfil
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Professionals;