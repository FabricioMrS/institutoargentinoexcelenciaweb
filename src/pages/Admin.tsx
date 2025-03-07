
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TestimonialsList } from "@/components/admin/TestimonialsList";
import { CoursesList } from "@/components/admin/CoursesList";
import { PendingTestimonials } from "@/components/admin/PendingTestimonials";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPendingTestimonials, setShowPendingTestimonials] = useState(false);
  const queryClient = useQueryClient();
  
  // Query for pending testimonials count with no caching
  const { data: pendingTestimonialsCount = 0, refetch: refetchPendingCount } = useQuery({
    queryKey: ['pending-testimonials-count'],
    queryFn: async () => {
      console.log("Fetching pending testimonials count");
      const { count, error } = await supabase
        .from('pending_testimonials')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error("Error fetching pending testimonials count:", error);
        throw error;
      }
      console.log("Fetched pending testimonials count:", count);
      return count || 0;
    },
    // Disable cache completely to always fetch fresh data
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  // Force a refresh when the component mounts or becomes visible again
  useEffect(() => {
    const refreshData = async () => {
      await queryClient.resetQueries({ queryKey: ['pending-testimonials-count'] });
      await refetchPendingCount();
    };
    
    refreshData();
    
    // Set up a refresh interval
    const interval = setInterval(refreshData, 5000); // Refresh every 5 seconds
    
    return () => clearInterval(interval);
  }, [refetchPendingCount, queryClient]);

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
    // Force refresh when testimonials panel is toggled
    refetchPendingCount();
  };

  if (!isAdmin) return null;

  return (
    <div className="container py-8">
      <AdminHeader 
        onTestimonialsClick={handleTogglePendingTestimonials}
      />

      <div className="grid gap-6">
        <PendingTestimonials 
          visible={showPendingTestimonials && pendingTestimonialsCount > 0} 
          pendingCount={pendingTestimonialsCount}
          onRefetch={refetchPendingCount}
        />

        <Card>
          <CardHeader>
            <CardTitle>Testimonios</CardTitle>
          </CardHeader>
          <CardContent>
            <TestimonialsList 
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
