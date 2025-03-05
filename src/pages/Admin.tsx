
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ApprovedTestimonialsList } from "@/components/admin/ApprovedTestimonialsList";
import { CoursesList } from "@/components/admin/CoursesList";
import { PendingTestimonialsPanel } from "@/components/admin/PendingTestimonialsPanel";
import { usePendingTestimonialsCount } from "@/utils/testimonialManager";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPendingTestimonials, setShowPendingTestimonials] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const fetchPendingCount = usePendingTestimonialsCount();
  
  // Query for pending testimonials count with no caching
  const { data: pendingTestimonialsCount = 0, refetch: refetchPendingCount } = useQuery({
    queryKey: ['pending-count'],
    queryFn: fetchPendingCount,
    refetchInterval: 3000, // Refresh every 3 seconds
    staleTime: 0,          // Always consider data stale
    gcTime: 0,             // Don't cache
  });

  // Update local state when count changes
  useEffect(() => {
    setPendingCount(pendingTestimonialsCount);
  }, [pendingTestimonialsCount]);

  // Handle count updates from the pending testimonials panel
  const handleCountChange = (count: number) => {
    setPendingCount(count);
  };

  // Queries for other data
  const { data: courses, isLoading: isLoadingCourses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
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
  });

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const handleTogglePendingTestimonials = () => {
    setShowPendingTestimonials(!showPendingTestimonials);
    refetchPendingCount();
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
