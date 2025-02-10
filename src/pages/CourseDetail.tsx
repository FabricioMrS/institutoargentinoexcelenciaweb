
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CourseInfo } from "@/components/CourseInfo";
import { CourseFinancing } from "@/components/CourseFinancing";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const cleanCourseId = courseId?.replace(/^\/curso\//, '');

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', cleanCourseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', cleanCourseId)
        .eq('enabled', true)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el curso",
        });
        navigate('/cursos');
        throw error;
      }
      
      if (!data) {
        navigate('/cursos');
        return null;
      }
      
      return data;
    },
    retry: false,
  });

  if (isLoading) {
    return <div className="w-full px-2 sm:px-4 md:px-6 py-6 md:py-12">Cargando...</div>;
  }

  if (!course) {
    navigate('/cursos');
    return null;
  }

  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 py-6 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 sm:mb-6 md:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 md:mb-4">{course.title}</h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{course.category}</p>
          </div>

          <div className="mb-4 sm:mb-6 md:mb-8">
            <img 
              src={course.image} 
              alt={course.title} 
              className="w-full h-40 sm:h-48 md:h-64 object-cover rounded-lg"
            />
          </div>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="grid gap-3 sm:gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <CourseInfo label="Precio" value={`$${Number(course.price).toLocaleString()}`} />
                  <CourseInfo label="Inicio" value={course.start_date} />
                  <CourseInfo label="Horario" value={course.schedule} />
                  <CourseInfo label="Modalidad" value={course.modality} />
                  <CourseInfo label="Duración" value={`${course.duration} meses`} />
                </div>
                <CourseFinancing
                  courseTitle={course.title}
                  price={course.price.toString()}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
