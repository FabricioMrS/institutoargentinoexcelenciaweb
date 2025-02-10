
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Pencil, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
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

  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('testimonials')
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

  const handlePhotoUpload = async (testimonialId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('teachers_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('teachers_photos')
        .getPublicUrl(filePath);

      // Update testimonial record
      const { error: updateError } = await supabase
        .from('testimonials')
        .update({ photo_url: publicUrl })
        .eq('id', testimonialId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });

      toast({
        title: "Éxito",
        description: "Foto actualizada correctamente",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo subir la foto",
      });
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
            <CardTitle>Testimonios</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingTestimonials ? (
              <p>Cargando testimonios...</p>
            ) : (
              <div className="space-y-4">
                {testimonials?.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.photo_url || undefined} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{testimonial.name}</h3>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="file"
                        id={`photo-${testimonial.id}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handlePhotoUpload(testimonial.id, file);
                          }
                        }}
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          document.getElementById(`photo-${testimonial.id}`)?.click();
                        }}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingCourses ? (
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
