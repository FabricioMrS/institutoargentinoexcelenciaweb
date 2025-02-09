
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Courses = () => {
  const navigate = useNavigate();

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container py-12">
      <div className="flex items-center justify-center mb-8">
        <img 
          src="/lovable-uploads/83991cd8-6df5-460f-94c7-18ceefafd352.png" 
          alt="Instituto Argentino Excelencia" 
          className="h-48 object-contain"
        />
      </div>
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Cursos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          <p className="text-center col-span-3">Cargando cursos...</p>
        ) : courses && courses.length > 0 ? (
          courses.map((course) => (
            <Card 
              key={course.id}
              className="cursor-pointer overflow-hidden transition-transform hover:scale-105"
              onClick={() => navigate(`/curso/${course.slug}`)}
            >
              <div className="h-48 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{course.category}</p>
                <p className="text-lg font-bold mt-2">${Number(course.price).toLocaleString()}</p>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center col-span-3">No hay cursos disponibles en este momento.</p>
        )}
      </div>
      <WhatsAppButton floating={true} />
    </div>
  );
};

export default Courses;
