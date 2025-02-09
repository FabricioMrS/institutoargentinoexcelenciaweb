
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const NewCourse = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { toast } = useToast();
  const isEditing = !!courseId;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
    price: "",
    startDate: "",
    schedule: "",
    modality: "",
    duration: "",
    slug: "",
  });

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        category: course.category,
        image: course.image,
        price: course.price.toString(),
        startDate: course.start_date,
        schedule: course.schedule,
        modality: course.modality,
        duration: course.duration.toString(),
        slug: course.slug,
      });
    }
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      title: formData.title,
      category: formData.category,
      image: formData.image,
      price: parseFloat(formData.price),
      start_date: formData.startDate,
      schedule: formData.schedule,
      modality: formData.modality,
      duration: parseInt(formData.duration),
      slug: formData.slug,
    };

    try {
      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId);

        if (error) throw error;
        toast({
          title: "Curso actualizado",
          description: "El curso se ha actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from('courses')
          .insert([courseData]);

        if (error) throw error;
        toast({
          title: "Curso creado",
          description: "El curso se ha creado correctamente",
        });
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Hubo un error al guardar el curso",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Curso' : 'Nuevo Curso'}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL amigable</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  required
                  placeholder="ejemplo-de-url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">URL de la imagen</Label>
                <Input
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                  type="url"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Precio</Label>
                <Input
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de inicio</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Horario</Label>
                <Input
                  id="schedule"
                  name="schedule"
                  value={formData.schedule}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="modality">Modalidad</Label>
                <Input
                  id="modality"
                  name="modality"
                  value={formData.modality}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (meses)</Label>
                <Input
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  type="number"
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Guardar cambios' : 'Crear curso'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewCourse;
