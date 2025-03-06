
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { CourseCard } from "@/components/CourseCard";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
        .order('created_at', { ascending: false });

      if (coursesError) throw coursesError;
      
      const courseIds = coursesData.map(course => course.id);
      
      const { data: financingData, error: financingError } = await supabase
        .from('course_financing_options')
        .select('*')
        .in('course_id', courseIds);
        
      if (financingError) throw financingError;
      
      // Combine courses with their financing options
      const coursesWithFinancing = coursesData.map(course => {
        const options = financingData.filter(option => option.course_id === course.id);
        return {
          ...course,
          financing_options: options
        };
      });
      
      return coursesWithFinancing;
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
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Nuestros Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-8">
          {isLoading ? (
            <p className="text-center col-span-1 md:col-span-3">Cargando cursos...</p>
          ) : courses && courses.length > 0 ? (
            courses.map((course) => {
              // Find the default financing option, if any
              let displayInstallments = null;
              let displayPrice = course.price;
              
              if (course.default_financing_option && course.financing_options) {
                const defaultOption = course.financing_options.find(
                  option => option.installments === course.default_financing_option
                );
                
                if (defaultOption) {
                  displayInstallments = defaultOption.installments;
                  // If interest rate applies, calculate new price
                  if (defaultOption.interest_rate > 0) {
                    displayPrice = course.price * (1 + defaultOption.interest_rate / 100) / defaultOption.installments;
                  } else {
                    displayPrice = course.price / defaultOption.installments;
                  }
                }
              }
              
              return (
                <CourseCard 
                  key={course.id}
                  title={course.title}
                  category={course.category}
                  image={course.image}
                  price={displayPrice.toFixed(2)}
                  slug={course.slug}
                  installments={displayInstallments}
                />
              );
            })
          ) : (
            <p className="text-center col-span-1 md:col-span-3">No hay cursos disponibles en este momento.</p>
          )}
        </div>
      </div>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Courses;
