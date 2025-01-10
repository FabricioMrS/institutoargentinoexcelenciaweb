import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[600px] flex items-center justify-center bg-primary">
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-8 animate-fadeIn">
          Aprende y Crece con Nosotros
        </h1>
        <p className="text-xl md:text-2xl mb-12 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Descubre cursos de calidad que transformarán tu futuro profesional
        </p>
        <Button 
          size="lg" 
          className="bg-secondary hover:bg-secondary-hover text-primary animate-fadeIn"
          style={{ animationDelay: "0.4s" }}
          onClick={() => navigate('/cursos')}
        >
          <GraduationCap className="mr-2" />
          Explorar Cursos
        </Button>
      </div>
    </div>
  );
};