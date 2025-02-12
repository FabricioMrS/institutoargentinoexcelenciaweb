
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Professional, ProfessionalFormData } from "@/types/professional";
import { ProfessionalForm } from "@/components/professionals/ProfessionalForm";
import { ProfessionalCard } from "@/components/professionals/ProfessionalCard";

const AdminProfessionals = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState<ProfessionalFormData>({
    name: "",
    role: "",
    description: "",
    specialties: "",
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['admin-professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Professional[];
    },
  });

  const handlePhotoUpload = async (professionalId: string, file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('professionals_photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('professionals_photos')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('professionals')
        .update({ image_url: publicUrl })
        .eq('id', professionalId);

      if (updateError) throw updateError;

      queryClient.invalidateQueries({ queryKey: ['admin-professionals'] });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const specialtiesArray = formData.specialties
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const professionalData = {
        name: formData.name,
        role: formData.role,
        description: formData.description,
        specialties: specialtiesArray,
      };

      if (editingProfessional) {
        const { error } = await supabase
          .from('professionals')
          .update(professionalData)
          .eq('id', editingProfessional.id);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Profesional actualizado correctamente",
        });
      } else {
        const { error } = await supabase
          .from('professionals')
          .insert([professionalData]);

        if (error) throw error;
        toast({
          title: "Éxito",
          description: "Profesional creado correctamente",
        });
      }

      queryClient.invalidateQueries({ queryKey: ['admin-professionals'] });
      setOpen(false);
      setFormData({ name: "", role: "", description: "", specialties: "" });
      setEditingProfessional(null);
    } catch (error) {
      console.error('Error saving professional:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo guardar el profesional",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este profesional?')) return;

    try {
      const { error } = await supabase
        .from('professionals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['admin-professionals'] });
      toast({
        title: "Éxito",
        description: "Profesional eliminado correctamente",
      });
    } catch (error) {
      console.error('Error deleting professional:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo eliminar el profesional",
      });
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      role: professional.role,
      description: professional.description,
      specialties: professional.specialties.join(', '),
    });
    setOpen(true);
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestión de Profesionales</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Profesional
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? "Editar Profesional" : "Agregar Nuevo Profesional"}
              </DialogTitle>
            </DialogHeader>
            <ProfessionalForm
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData}
              editingProfessional={editingProfessional}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profesionales</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Cargando profesionales...</p>
          ) : (
            <div className="space-y-4">
              {professionals?.map((professional) => (
                <ProfessionalCard
                  key={professional.id}
                  professional={professional}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onPhotoUpload={handlePhotoUpload}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfessionals;
