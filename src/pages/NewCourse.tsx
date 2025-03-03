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
import { Checkbox } from "@/components/ui/checkbox";

interface FinancingOption {
  installments: number;
  interest_rate: number;
  enabled: boolean;
}

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

  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([
    { installments: 1, interest_rate: 0, enabled: true },
    { installments: 3, interest_rate: 15, enabled: false },
    { installments: 6, interest_rate: 30, enabled: false },
    { installments: 12, interest_rate: 60, enabled: false },
  ]);

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

  const { data: existingFinancingOptions } = useQuery({
    queryKey: ['financing-options', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      const { data, error } = await supabase
        .from('course_financing_options')
        .select('*')
        .eq('course_id', courseId);

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

  useEffect(() => {
    if (existingFinancingOptions && existingFinancingOptions.length > 0) {
      const updatedOptions = [...financingOptions];
      existingFinancingOptions.forEach(option => {
        const index = updatedOptions.findIndex(o => o.installments === option.installments);
        if (index !== -1) {
          updatedOptions[index] = {
            installments: option.installments,
            interest_rate: option.interest_rate,
            enabled: true
          };
        } else {
          updatedOptions.push({
            installments: option.installments,
            interest_rate: option.interest_rate,
            enabled: true
          });
        }
      });
      setFinancingOptions(updatedOptions);
    }
  }, [existingFinancingOptions]);

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
      let newCourseId = courseId;
      
      if (isEditing) {
        const { error } = await supabase
          .from('courses')
          .update(courseData)
          .eq('id', courseId);

        if (error) throw error;
        
        const { error: deleteError } = await supabase
          .from('course_financing_options')
          .delete()
          .eq('course_id', courseId);
          
        if (deleteError) throw deleteError;
        
        toast({
          title: "Curso actualizado",
          description: "El curso se ha actualizado correctamente",
        });
      } else {
        const { data, error } = await supabase
          .from('courses')
          .insert([courseData])
          .select();

        if (error) throw error;
        
        newCourseId = data[0].id;
        
        toast({
          title: "Curso creado",
          description: "El curso se ha creado correctamente",
        });
      }
      
      const enabledOptions = financingOptions.filter(option => option.enabled);
      if (enabledOptions.length > 0 && newCourseId) {
        const financingData = enabledOptions.map(option => ({
          course_id: newCourseId,
          installments: option.installments,
          interest_rate: option.interest_rate
        }));
        
        const { error: financingError } = await supabase
          .from('course_financing_options')
          .insert(financingData);
          
        if (financingError) throw financingError;
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

  const handleFinancingChange = (index: number, enabled: boolean) => {
    const updatedOptions = [...financingOptions];
    updatedOptions[index].enabled = enabled;
    setFinancingOptions(updatedOptions);
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <div className="mt-6">
              <Label>Opciones de financiación</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {financingOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <Checkbox 
                      id={`financing-${option.installments}`}
                      checked={option.enabled}
                      onCheckedChange={(checked) => handleFinancingChange(index, !!checked)}
                    />
                    <label
                      htmlFor={`financing-${option.installments}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1"
                    >
                      {option.installments === 1 
                        ? '1 pago (sin interés)' 
                        : `${option.installments} cuotas (+${option.interest_rate}% interés)`
                      }
                    </label>
                  </div>
                ))}
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
