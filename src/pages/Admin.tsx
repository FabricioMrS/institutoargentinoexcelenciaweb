import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { TestimonialsList } from "@/components/admin/TestimonialsList";
import { CoursesList } from "@/components/admin/CoursesList";
import { PendingTestimonials } from "@/components/admin/PendingTestimonials";
import { Course } from "@/types/course";

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

  // useEffect for refreshing data
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
  const { data: courses, isLoading: isLoadingCourses } = useQuery<Course[]>({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*, enrollment_password')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Course[];
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

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="testimonials">
            Testimonios
            {pendingTestimonialsCount > 0 && (
              <span className="ml-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {pendingTestimonialsCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="courses">Cursos</TabsTrigger>
          <TabsTrigger value="professionals">Profesionales</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Testimonios Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingTestimonialsCount}</div>
                <p className="text-xs text-muted-foreground">
                  Esperando aprobación
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Cursos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{courses?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Cursos disponibles
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Testimonios Publicados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{testimonials?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Testimonios activos
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="testimonials" className="space-y-6">
          <PendingTestimonials 
            visible={pendingTestimonialsCount > 0} 
            pendingCount={pendingTestimonialsCount}
            onRefetch={refetchPendingCount}
          />

          <Card>
            <CardHeader>
              <CardTitle>Testimonios Publicados</CardTitle>
            </CardHeader>
            <CardContent>
              <TestimonialsList 
                testimonials={testimonials || []} 
                isLoading={isLoadingTestimonials} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Cursos</CardTitle>
            </CardHeader>
            <CardContent>
              <CoursesList 
                courses={courses || []} 
                isLoading={isLoadingCourses} 
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professionals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Profesionales</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Haz clic en "Gestionar Profesionales" en el header para acceder a esta sección.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
