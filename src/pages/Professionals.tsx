
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Professional } from "@/types/professional";

const Professionals = () => {
  const [expandedProfessionals, setExpandedProfessionals] = useState<Record<string, boolean>>({});

  const toggleProfessionalDetails = (id: string) => {
    setExpandedProfessionals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const { data: professionals, isLoading } = useQuery<Professional[]>({
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
          <Card key={professional.id} className="hover:shadow-lg transition-shadow overflow-hidden">
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
              <div className="flex flex-wrap gap-2 mb-4">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="secondary">
                    {specialty}
                  </Badge>
                ))}
              </div>
              
              <Accordion 
                type="single" 
                collapsible
                value={expandedProfessionals[professional.id] ? professional.id : ""}
              >
                <AccordionItem value={professional.id} className="border-none">
                  <div className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full flex justify-between"
                      onClick={() => toggleProfessionalDetails(professional.id)}
                    >
                      <span>Ver Perfil</span>
                      {expandedProfessionals[professional.id] ? (
                        <ChevronUp className="h-4 w-4 ml-2" />
                      ) : (
                        <ChevronDown className="h-4 w-4 ml-2" />
                      )}
                    </Button>
                  </div>
                  <AccordionContent>
                    <div className="mt-4 text-muted-foreground">
                      <h4 className="font-medium text-foreground mb-2">Descripción:</h4>
                      <p>{professional.description}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Professionals;
