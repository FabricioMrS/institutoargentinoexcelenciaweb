
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Upload } from "lucide-react";
import { Professional } from "@/types/professional";

interface ProfessionalCardProps {
  professional: Professional;
  onEdit: (professional: Professional) => void;
  onDelete: (id: string) => void;
  onPhotoUpload: (id: string, file: File) => Promise<void>;
}

export const ProfessionalCard = ({
  professional,
  onEdit,
  onDelete,
  onPhotoUpload,
}: ProfessionalCardProps) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src={professional.image_url} alt={professional.name} />
          <AvatarFallback>{professional.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{professional.name}</h3>
          <p className="text-sm text-muted-foreground">{professional.role}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {professional.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="file"
          id={`photo-${professional.id}`}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              onPhotoUpload(professional.id, file);
            }
          }}
        />
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            document.getElementById(`photo-${professional.id}`)?.click();
          }}
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onEdit(professional)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => onDelete(professional.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
