
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { CourseInfo } from "@/components/CourseInfo";
import { CourseFinancing } from "@/components/CourseFinancing";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const CourseDetail = () => {
  const { courseId } = useParams();

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="container py-12">Cargando...</div>;
  }

  if (!course) {
    return <div className="container py-12">Curso no encontrado</div>;
  }

  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
          <p className="text-lg text-muted-foreground">{course.category}</p>
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
