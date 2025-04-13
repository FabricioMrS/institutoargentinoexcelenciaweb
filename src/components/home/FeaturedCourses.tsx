
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";
import { Course } from "@/types/course";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FeaturedCourses = () => {
  const navigate = useNavigate();
  
  const { data: featuredCourses = [], isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true as any)
        .eq('featured', true as any)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      // Cast the data to Course[] to fix type errors
      return (data || []) as Course[];
    },
  });

  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-8">
          Nuestros Cursos Destacados
        </h2>
        {isLoadingCourses ? (
          <p className="text-center dark:text-gray-300">Cargando cursos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                main_category={course.main_category || undefined}
                image={course.image}
                price={course.price.toString()}
                slug={course.slug}
              />
            ))}
          </div>
        )}
        
        <div className="flex justify-center mt-8">
          <Button 
            onClick={() => navigate("/cursos")} 
            className="px-6"
            variant="secondary"
          >
            Ver más cursos
          </Button>
        </div>
      </div>
    </section>
  );
};
