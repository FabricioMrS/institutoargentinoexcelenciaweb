
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    window.open("https://lovable.dev/projects/e818ffb1-ab9b-4e7d-beb7-5ea1f0d2daba", "_blank");
  };

  return (
    <Button 
      onClick={handleClick} 
      className={className}
      size={size}
      variant={variant}
    >
      <span>Academia Virtual</span>
      <ExternalLink className="ml-2 h-4 w-4" />
    </Button>
  );
};
