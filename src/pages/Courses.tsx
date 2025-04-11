
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Briefcase, ArrowRight } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Course } from "@/types/course";

const Courses = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();

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
  
  const gradientBgMedical = theme === 'dark' 
    ? 'bg-gradient-to-r from-blue-900/40 to-blue-800/60' 
    : 'bg-gradient-to-r from-blue-100 to-blue-200';
    
  const gradientBgProfessional = theme === 'dark' 
    ? 'bg-gradient-to-r from-amber-900/40 to-amber-800/60' 
    : 'bg-gradient-to-r from-amber-100 to-amber-200';

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-6 sm:px-10 md:px-16 py-10 md:py-16 max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-6 md:mb-8">
          <img 
            src={theme === 'dark' 
              ? "/lovable-uploads/83991cd8-6df5-460f-94c7-18ceefafd352.png"
              : "/lovable-uploads/332a7955-3409-4607-9f07-dc6d9556d6dc.png"} 
            alt="Instituto Argentino Excelencia" 
            className="h-24 sm:h-32 md:h-48 object-contain"
          />
        </div>
        
        <div className="max-w-3xl mx-auto text-center mb-10 md:mb-16">
          <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Nuestros Cursos
          </h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
            Elija entre nuestra amplia gama de programas educativos diseñados para potenciar su carrera profesional
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 mb-12 max-w-5xl mx-auto">
          {/* Medical courses category */}
          <Card 
            className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            onClick={() => navigate('/cursos/medical')}
          >
            <div className={`h-48 sm:h-56 ${gradientBgMedical} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-repeat-space" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              </div>
              <BookOpen className={`h-16 w-16 mb-3 ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`} />
              <h3 className={`text-xl md:text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-blue-800'} relative z-10`}>
                Preparación Universitaria
              </h3>
              <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'}`}>
                Medicina
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
                Cursos especializados para estudiantes de medicina y profesionales del área de salud.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {medicalCourses.length} curso{medicalCourses.length !== 1 ? 's' : ''} disponible{medicalCourses.length !== 1 ? 's' : ''}
                </div>
                <div className={`flex items-center gap-1 font-medium ${theme === 'dark' ? 'text-blue-300' : 'text-blue-600'}`}>
                  <span>Ver cursos</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Card>
          
          {/* Professional courses category */}
          <Card 
            className={`cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}
            onClick={() => navigate('/cursos/professional')}
          >
            <div className={`h-48 sm:h-56 ${gradientBgProfessional} flex flex-col items-center justify-center p-6 relative overflow-hidden`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-repeat-space" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
              </div>
              <Briefcase className={`h-16 w-16 mb-3 ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`} />
              <h3 className={`text-xl md:text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-amber-800'} relative z-10`}>
                Formación Profesional
              </h3>
              <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${theme === 'dark' ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'}`}>
                Oficio
              </span>
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
                Cursos técnicos y de oficios para el desarrollo de habilidades profesionales.
              </p>
              <div className="mt-auto flex items-center justify-between">
                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {professionalCourses.length} curso{professionalCourses.length !== 1 ? 's' : ''} disponible{professionalCourses.length !== 1 ? 's' : ''}
                </div>
                <div className={`flex items-center gap-1 font-medium ${theme === 'dark' ? 'text-amber-300' : 'text-amber-600'}`}>
                  <span>Ver cursos</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
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
