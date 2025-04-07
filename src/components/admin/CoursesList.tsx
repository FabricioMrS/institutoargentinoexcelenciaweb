
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

interface CoursesListProps {
  courses: any[];
  isLoading: boolean;
}

export const CoursesList = ({ courses, isLoading }: CoursesListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ enabled: !currentStatus })
      .eq('id', courseId);

    if (error) {
      console.error('Error toggling course status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo actualizar el estado del curso",
      });
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      
      toast({
        title: "Éxito",
        description: `Curso ${!currentStatus ? 'habilitado' : 'deshabilitado'} correctamente`,
      });
    }
  };

  const getCategoryBadge = (main_category: string) => {
    if (main_category === 'medical') {
      return <Badge variant="default" className="bg-blue-600">Medicina</Badge>;
    } else if (main_category === 'professional') {
      return <Badge variant="default" className="bg-amber-600">Oficio</Badge>;
    }
    return null;
  };

  if (isLoading) return <p>Cargando cursos...</p>;

  return (
    <div className="space-y-4">
      {courses?.map((course) => (
        <div
          key={course.id}
          className="flex items-center justify-between p-4 border rounded-lg"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium">{course.title}</h3>
              {getCategoryBadge(course.main_category)}
            </div>
            <p className="text-sm text-muted-foreground">
              {course.category} - ${course.price}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Toggle
              pressed={course.enabled}
              onPressedChange={() => toggleCourseStatus(course.id, course.enabled)}
            >
              {course.enabled ? 'Habilitado' : 'Deshabilitado'}
            </Toggle>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/admin/curso/${course.id}`)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
