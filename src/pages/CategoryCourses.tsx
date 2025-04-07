
import { Card } from "@/components/ui/card";
import { useNavigate, useParams } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const CategoryCourses = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  
  const categoryTitle = category === 'medical' 
    ? 'Preparación Universitaria - Medicina' 
    : 'Formación Profesional - Oficio';
  
  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses', category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
        .eq('main_category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
        
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="flex items-center gap-2" 
            onClick={() => navigate('/cursos')}
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a categorías
          </Button>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">
          {categoryTitle}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {isLoading ? (
            <p className="text-center col-span-1 md:col-span-3">Cargando cursos...</p>
          ) : courses && courses.length > 0 ? (
            courses.map((course) => (
              <Card 
                key={course.id}
                className="cursor-pointer overflow-hidden transition-transform hover:scale-105"
                onClick={() => navigate(`/curso/${course.slug}`)}
              >
                <div className="h-32 sm:h-40 md:h-48 overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-2">{course.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{course.category}</p>
                </div>
              </Card>
            ))
          ) : (
            <p className="text-center col-span-1 md:col-span-3">No hay cursos disponibles en esta categoría.</p>
          )}
        </div>
      </div>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default CategoryCourses;
