
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Professional, ProfessionalFormData } from "@/types/professional";

interface ProfessionalFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ProfessionalFormData;
  setFormData: (data: ProfessionalFormData) => void;
  editingProfessional: Professional | null;
}

export const ProfessionalForm = ({
  onSubmit,
  formData,
  setFormData,
  editingProfessional,
}: ProfessionalFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="role">Rol</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="specialties">Especialidades (separadas por comas)</Label>
        <Input
          id="specialties"
          value={formData.specialties}
          onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
          placeholder="Ej: Anatomía, Fisiología, Biología"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {editingProfessional ? "Actualizar" : "Crear"}
      </Button>
    </form>
  );
};
