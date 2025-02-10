
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
  
  // Clean up the courseId by removing any duplicate /curso/ patterns
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

      if (error) throw error;
      return data;
    },
    meta: {
      errorMessage: "No se pudo cargar el curso"
    },
    retry: false,
    onSettled: (data, error) => {
      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo cargar el curso",
        });
        navigate('/cursos');
      }
    }
  });

  if (isLoading) {
    return <div className="container py-12">Cargando...</div>;
  }

  if (!course) {
    navigate('/cursos');
    return null;
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.category}</p>
        </div>

        <div className="mb-8">
          <img 
            src={course.image} 
            alt={course.title} 
            className="w-full h-64 object-cover rounded-lg"
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
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
  );
};

export default CourseDetail;
