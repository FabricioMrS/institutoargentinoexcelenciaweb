
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApprovedTestimonialsList } from "@/components/admin/ApprovedTestimonialsList";
import { PendingTestimonialsPanel } from "@/components/admin/PendingTestimonialsPanel";

const AdminTestimonials = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Query for approved testimonials
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
    refetchInterval: 3000, // Refresh every 3 seconds
  });

  // Handle count updates from the pending testimonials panel
  const handleCountChange = (count: number) => {
    setPendingCount(count);
    // Force refresh approved testimonials
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Administrar Testimonios</h1>
      
      <PendingTestimonialsPanel 
        visible={true} 
        onCountChange={handleCountChange}
      />

      <Card>
        <CardHeader>
          <CardTitle>Testimonios Aprobados</CardTitle>
        </CardHeader>
        <CardContent>
          <ApprovedTestimonialsList 
            testimonials={testimonials || []} 
            isLoading={isLoadingTestimonials} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTestimonials;
