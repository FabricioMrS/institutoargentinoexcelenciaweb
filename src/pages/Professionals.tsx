import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Professional {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  specialties: string[];
}

const professionals: Professional[] = [
  {
    id: 1,
    name: "Dra. María González",
    role: "Profesora de Inglés Médico",
    description: "Doctora en Medicina con especialización en idiomas. Más de 15 años de experiencia enseñando inglés médico a estudiantes y profesionales de la salud. Certificada en metodologías de enseñanza de idiomas para propósitos específicos.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    specialties: ["Inglés Médico", "Terminología Médica", "Comunicación Clínica"]
  },
  {
    id: 2,
    name: "Prof. Carlos Rodríguez",
    role: "Profesor de Medicina UNC",
    description: "Profesor titular de Anatomía en la UNC con más de 20 años de experiencia en docencia universitaria. Especialista en metodologías de enseñanza innovadoras y aprendizaje basado en problemas.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    specialties: ["Anatomía", "Fisiología", "Metodología de Estudio"]
  },
  {
    id: 3,
    name: "Lic. Laura Sánchez",
    role: "Profesora de Inglés General",
    description: "Licenciada en Lenguas con especialización en enseñanza del inglés. Amplia experiencia en preparación para exámenes internacionales y english for academic purposes.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    specialties: ["Inglés Académico", "Preparación TOEFL", "Conversación"]
  },
  {
    id: 4,
    name: "Dr. Juan Pérez",
    role: "Profesor de Medicina",
    description: "Doctor en Medicina y especialista en educación médica. Combina su práctica clínica con la docencia, aportando casos reales y experiencia práctica a sus clases.",
    image: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    specialties: ["Medicina Interna", "Casos Clínicos", "Semiología"]
  },
  {
    id: 5,
    name: "Prof. Ana Martínez",
    role: "Coordinadora Académica",
    description: "Máster en Educación y especialista en diseño curricular. Coordina los programas académicos asegurando la calidad y coherencia de los contenidos.",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
    specialties: ["Diseño Curricular", "Gestión Educativa", "Evaluación"]
  }
];

const Professionals = () => {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-16 animate-fadeIn">
        <h1 className="text-4xl font-bold mb-8">Nosotros</h1>
        <p className="text-lg leading-relaxed text-muted-foreground bg-secondary/10 p-6 rounded-lg shadow-sm">
          En Instituto Argentino Excelencia ofrecemos servicios educativos especializados para la preparación de estudiantes universitarios en instancias evaluativas y de cursado. Además brindamos cursos de formación profesional dirigidos a personas que buscan adquirir herramientas prácticas y competencias claves para el mercado actual, en distintos niveles educativos.
        </p>
      </div>
      <h2 className="text-3xl font-bold text-center mb-12">Nuestros Profesionales</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals.map((professional) => (
          <Card key={professional.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32">
                  <AvatarImage src={professional.image} alt={professional.name} />
                  <AvatarFallback>{professional.name[0]}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">{professional.name}</h3>
                  <p className="text-primary">{professional.role}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{professional.description}</p>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty, index) => (
                  <span
                    key={index}
                    className="bg-secondary/20 text-secondary-foreground text-sm px-2 py-1 rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Professionals;