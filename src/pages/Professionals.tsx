
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Professional {
  id: string;
  name: string;
  role: string;
  specialties: string[];
  image_url?: string;
  description: string;
}

const Professionals = () => {
  const navigate = useNavigate();

  const { data: professionals, isLoading } = useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('professionals')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Professional[];
    },
  });

  if (isLoading) {
    return (
      <div className="container py-12">
        <p className="text-center">Cargando profesionales...</p>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Nuestros Profesionales</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {professionals?.map((professional) => (
          <Card key={professional.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={professional.image_url} alt={professional.name} />
                <AvatarFallback>{professional.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{professional.name}</h3>
                <p className="text-muted-foreground">{professional.role}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{professional.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(`/profesional/${professional.id}`)}
              >
                Ver Perfil
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Professionals;
