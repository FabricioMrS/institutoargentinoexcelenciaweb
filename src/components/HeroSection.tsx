
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AcademyVirtualButton } from "./AcademyVirtualButton";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[600px] flex items-center justify-center bg-primary">
      <div className="container mx-auto px-6 py-20 text-center text-white">
        <div className="mb-8">
          <img 
            src="/lovable-uploads/83991cd8-6df5-460f-94c7-18ceefafd352.png" 
            alt="Instituto Argentino Excelencia" 
            className="h-48 object-contain mx-auto mb-4"
          />
          <div className="w-full max-w-3xl mx-auto h-px bg-secondary mb-8"></div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fadeIn">
          Instituto Argentino Excelencia
        </h1>
        <p className="text-xl md:text-2xl mb-12 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          Descubre cursos de calidad que transformarán tu futuro profesional
        </p>
        <div className="flex flex-col gap-4 justify-center items-center animate-fadeIn" style={{ animationDelay: "0.4s" }}>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary-hover text-primary w-full sm:w-auto"
            onClick={() => navigate('/cursos')}
          >
            <GraduationCap className="mr-2" />
            Explorar Cursos
          </Button>
          
          <AcademyVirtualButton 
            className="font-medium text-lg mt-2"
          />
        </div>
      </div>
    </div>
  );
};
