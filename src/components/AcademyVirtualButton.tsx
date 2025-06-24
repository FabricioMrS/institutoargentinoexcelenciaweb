
import { ExternalLink, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AcademyVirtualButtonProps {
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export const AcademyVirtualButton = ({ 
  className = "", 
  size = "default",
  variant = "default"
}: AcademyVirtualButtonProps) => {
  const handleClick = () => {
    // Mostrar mensaje de "en proceso" en lugar de abrir el enlace
    alert("Academia Virtual - En proceso de desarrollo");
  };

  return (
    <button 
      onClick={handleClick} 
      className={cn(
        "text-secondary hover:text-secondary-hover transition-all duration-300 flex items-center gap-1 group", 
        className
      )}
    >
      <span className="border-b border-transparent group-hover:border-secondary-hover transition-all duration-300">Academia Virtual</span>
      <Clock className="h-4 w-4 opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};
