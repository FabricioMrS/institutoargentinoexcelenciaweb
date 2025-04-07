
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Briefcase } from "lucide-react";

interface Course {
  id: string;
  title: string;
  category: string;
  main_category: string | null;
  image: string;
  price: number;
  slug: string;
  created_at: string;
  enabled: boolean;
  default_financing_option: number | null;
  duration: number;
  modality: string;
  schedule: string;
  start_date: string;
  updated_at: string;
  featured: boolean | null;
}

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
    },
  });

  // Group courses by main category
  const medicalCourses = courses?.filter(course => course.main_category === 'medical') || [];
  const professionalCourses = courses?.filter(course => course.main_category === 'professional') || [];

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 py-6 md:py-12">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <img 
            src="/lovable-uploads/83991cd8-6df5-460f-94c7-18ceefafd352.png" 
            alt="Instituto Argentino Excelencia" 
            className="h-24 sm:h-32 md:h-48 object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Nuestros Cursos</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12">
          {/* Medical courses category */}
          <Card 
            className="cursor-pointer overflow-hidden transition-transform hover:scale-105 flex flex-col"
            onClick={() => navigate('/cursos/medical')}
          >
            <div className="h-40 sm:h-48 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-secondary" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-3">Preparación Universitaria - Medicina</h3>
              <p className="text-muted-foreground text-center mb-4">
                Cursos especializados para estudiantes de medicina y profesionales del área de salud.
              </p>
              <div className="mt-auto text-center text-sm text-muted-foreground">
                {medicalCourses.length} curso{medicalCourses.length !== 1 ? 's' : ''} disponible{medicalCourses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>
          
          {/* Professional courses category */}
          <Card 
            className="cursor-pointer overflow-hidden transition-transform hover:scale-105 flex flex-col"
            onClick={() => navigate('/cursos/professional')}
          >
            <div className="h-40 sm:h-48 bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Briefcase className="h-16 w-16 text-secondary" />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl md:text-2xl font-semibold text-center mb-3">Formación Profesional - Oficio</h3>
              <p className="text-muted-foreground text-center mb-4">
                Cursos técnicos y de oficios para el desarrollo de habilidades profesionales.
              </p>
              <div className="mt-auto text-center text-sm text-muted-foreground">
                {professionalCourses.length} curso{professionalCourses.length !== 1 ? 's' : ''} disponible{professionalCourses.length !== 1 ? 's' : ''}
              </div>
            </div>
          </Card>
        </div>
      </div>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Courses;
