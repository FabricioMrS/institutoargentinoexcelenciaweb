import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ApprovedTestimonialsList } from "@/components/admin/ApprovedTestimonialsList";
import { CoursesList } from "@/components/admin/CoursesList";
import { PendingTestimonialsPanel } from "@/components/admin/PendingTestimonialsPanel";
import { usePendingTestimonialsCount } from "@/utils/testimonialManager";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPendingTestimonials, setShowPendingTestimonials] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const fetchPendingCount = usePendingTestimonialsCount();
  
  const { data: pendingTestimonialsCount = 0, refetch: refetchPendingCount } = useQuery({
    queryKey: ['pending-count'],
    queryFn: fetchPendingCount,
    refetchInterval: 3000,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    setPendingCount(pendingTestimonialsCount);
  }, [pendingTestimonialsCount]);

  const handleCountChange = (count: number) => {
    setPendingCount(count);
    queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
    queryClient.invalidateQueries({ queryKey: ['pending-count'] });
    queryClient.invalidateQueries({ queryKey: ['pending-testimonials'] });
  };

  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, course_financing_options(*)')
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
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleTogglePendingTestimonials = () => {
    setShowPendingTestimonials(!showPendingTestimonials);
    refetchPendingCount();
    queryClient.invalidateQueries();
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <AdminHeader 
        pendingTestimonialsCount={pendingCount} 
        onTestimonialsClick={handleTogglePendingTestimonials}
      />

      <div className="grid gap-6">
        <PendingTestimonialsPanel 
          visible={showPendingTestimonials} 
          onCountChange={handleCountChange}
        />

        <Card>
          <CardHeader>
            <CardTitle>Testimonios</CardTitle>
          </CardHeader>
          <CardContent>
            <ApprovedTestimonialsList 
              testimonials={testimonials || []} 
              isLoading={isLoadingTestimonials} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cursos</CardTitle>
          </CardHeader>
          <CardContent>
            <CoursesList 
              courses={courses || []} 
              isLoading={isLoadingCourses} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
