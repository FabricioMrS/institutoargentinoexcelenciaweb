
import { Button } from "@/components/ui/button";
import { Users, BellDot, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  pendingTestimonialsCount: number;
}

export const AdminHeader = ({ pendingTestimonialsCount }: AdminHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <div className="flex gap-4">
        <Button onClick={() => navigate('/admin/profesionales')}>
          <Users className="w-4 h-4 mr-2" />
          Gestionar Profesionales
        </Button>
        <Button onClick={() => navigate('/admin/testimonials')} variant={pendingTestimonialsCount > 0 ? "destructive" : "default"}>
          {pendingTestimonialsCount > 0 ? (
            <>
              <BellDot className="w-4 h-4 mr-2" />
              {pendingTestimonialsCount} Testimonios pendientes
            </>
          ) : (
            <>
              <MessageSquare className="w-4 h-4 mr-2" />
              Testimonios
            </>
          )}
        </Button>
        <Button onClick={() => navigate('/admin/curso/nuevo')}>
          Crear Nuevo Curso
        </Button>
      </div>
    </div>
  );
};
