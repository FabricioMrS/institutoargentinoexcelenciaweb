
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle, X } from "lucide-react";

interface FinancingOption {
  installments: number;
  interest_rate: number;
}

interface Course {
  id: string;
  title: string;
  category: string;
  main_category: string | null;
  image: string;
  price: number;
  start_date: string;
  schedule: string;
  modality: string;
  duration: number;
  slug: string;
  created_at: string;
  updated_at: string;
  enabled: boolean | null;
  default_financing_option: number | null;
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
    main_category: "",
    image: "",
    price: "",
    startDate: "",
    schedule: "",
    modality: "",
    duration: "",
    slug: "",
  });

  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([
    { installments: 1, interest_rate: 0 },
  ]);

  const [newOption, setNewOption] = useState({
    installments: "3",
    interest_rate: "0",
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
      return data as Course;
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
        main_category: course.main_category || "",
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
      setFinancingOptions(existingFinancingOptions.map(option => ({
        installments: option.installments,
        interest_rate: option.interest_rate
      })));
    }
  }, [existingFinancingOptions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const courseData = {
      title: formData.title,
      category: formData.category,
      main_category: formData.main_category,
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
      
      if (financingOptions.length > 0 && newCourseId) {
        const financingData = financingOptions.map(option => ({
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFinancingOption = () => {
    const installments = parseInt(newOption.installments);
    const interest_rate = parseFloat(newOption.interest_rate);
    
    // Check if this installment option already exists
    const exists = financingOptions.some(option => option.installments === installments);
    
    if (!exists) {
      setFinancingOptions([...financingOptions, { 
        installments, 
        interest_rate 
      }]);
      
      setNewOption({
        installments: "",
        interest_rate: "0"
      });
    } else {
      toast({
        title: "Opción duplicada",
        description: `Ya existe una opción para ${installments} cuotas`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setFinancingOptions(financingOptions.filter((_, index) => index !== indexToRemove));
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
                <Label htmlFor="main_category">Categoría Principal</Label>
                <Select
                  value={formData.main_category}
                  onValueChange={(value) => handleSelectChange("main_category", value)}
                  required
                >
                  <SelectTrigger id="main_category">
                    <SelectValue placeholder="Seleccione una categoría principal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Preparación Universitaria - Medicina</SelectItem>
                    <SelectItem value="professional">Formación Profesional - Oficio</SelectItem>
                  </SelectContent>
                </Select>
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
              
              <div className="grid grid-cols-1 gap-4 mt-2">
                {financingOptions.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
                    <div className="flex-1">
                      {option.installments === 1 
                        ? '1 pago (sin interés)' 
                        : `${option.installments} cuotas (+${option.interest_rate}% interés)`
                      }
                    </div>
                    {option.installments !== 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveOption(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                
                <div className="flex items-end gap-4 p-3 border rounded-md">
                  <div className="flex-1">
                    <Label htmlFor="installments">Número de cuotas</Label>
                    <Select
                      value={newOption.installments}
                      onValueChange={(value) => setNewOption({...newOption, installments: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona número de cuotas" />
                      </SelectTrigger>
                      <SelectContent>
                        {[3, 6, 9, 12, 18, 24].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} cuotas
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex-1">
                    <Label htmlFor="interest_rate">Interés (%)</Label>
                    <Input
                      id="interest_rate"
                      name="interest_rate"
                      value={newOption.interest_rate}
                      onChange={(e) => setNewOption({...newOption, interest_rate: e.target.value})}
                      type="number"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleAddFinancingOption}
                    disabled={!newOption.installments}
                  >
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Agregar
                  </Button>
                </div>
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
