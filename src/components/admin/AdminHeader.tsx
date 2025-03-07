
import { Button } from "@/components/ui/button";
import { Users, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface AdminHeaderProps {
  onTestimonialsClick?: () => void;
}

export const AdminHeader = ({ onTestimonialsClick }: AdminHeaderProps) => {
  const navigate = useNavigate();

  const { data: pendingTestimonialsCount = 0 } = useQuery({
    queryKey: ['pending-testimonials-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('pending_testimonials')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    },
    // Disable cache to always get fresh data
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const handleTestimonialsClick = (e: React.MouseEvent) => {
    if (onTestimonialsClick) {
      e.preventDefault();
      onTestimonialsClick();
    } else {
      navigate('/admin/testimoniales');
    }
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Panel de Administración</h1>
      <div className="flex gap-4">
        <Button onClick={handleTestimonialsClick} variant="outline">
          <MessageSquare className="w-4 h-4 mr-2" />
          Testimonios 
          {pendingTestimonialsCount > 0 && (
            <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {pendingTestimonialsCount}
            </span>
          )}
        </Button>
        <Button onClick={() => navigate('/admin/profesionales')}>
          <Users className="w-4 h-4 mr-2" />
          Gestionar Profesionales
        </Button>
        <Button onClick={() => navigate('/admin/curso/nuevo')}>
          Crear Nuevo Curso
        </Button>
      </div>
    </div>
  );
};
