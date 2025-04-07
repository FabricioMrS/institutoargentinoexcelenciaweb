
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CourseCard } from "@/components/CourseCard";

interface Course {
  id: string;
  title: string;
  category: string;
  main_category: string | null;
  image: string;
  price: number;
  slug: string;
  featured: boolean | null;
  enabled: boolean;
  duration: number;
  modality: string;
  schedule: string;
  start_date: string;
  created_at: string;
  updated_at: string;
  default_financing_option: number | null;
}

export const FeaturedCourses = () => {
  const { data: featuredCourses = [], isLoading: isLoadingCourses } = useQuery({
    queryKey: ['featured-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('enabled', true)
        .eq('featured', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Course[];
    },
  });

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Nuestros Cursos Destacados
        </h2>
        {isLoadingCourses ? (
          <p className="text-center">Cargando cursos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard
                key={course.id}
                title={course.title}
                category={course.category}
                main_category={course.main_category}
                image={course.image}
                price={course.price.toString()}
                slug={course.slug}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
