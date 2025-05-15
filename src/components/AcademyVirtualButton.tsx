
import { ExternalLink } from "lucide-react";
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
    window.open("https://preview--teachwave-academy-hub.lovable.app/", "_blank");
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
      <ExternalLink className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
    </button>
  );
};
