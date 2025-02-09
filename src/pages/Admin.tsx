
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Pencil } from "lucide-react";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const toggleCourseStatus = async (courseId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('courses')
      .update({ enabled: !currentStatus })
      .eq('id', courseId);

    if (error) {
      console.error('Error toggling course status:', error);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <Button onClick={() => navigate('/admin/curso/nuevo')}>
          Crear Nuevo Curso
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Cargando cursos...</p>
            ) : (
              <div className="space-y-4">
                {courses?.map((course) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{course.title}</h3>
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
