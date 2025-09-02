
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  floating?: boolean;
  courseTitle?: string;
  selectedInstallments?: number;
  price?: string;
  interestRate?: number;
}

export const WhatsAppButton = ({ 
  message,
  floating = false,
  courseTitle,
  selectedInstallments,
  price,
  interestRate = 0
}: WhatsAppButtonProps) => {
  const whatsappLink = "https://bit.ly/4m6QqbS";
  
  const handleWhatsAppClick = () => {
    const newWindow = window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.opener = null;
  };

  const baseClasses = "bg-green-500 hover:bg-green-600 text-white";
  const floatingClasses = floating ? 
    "fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg z-50" : 
    "w-full";

  return (
    <Button 
      className={`${baseClasses} ${floatingClasses}`}
      onClick={handleWhatsAppClick}
    >
      <MessageCircle className={floating ? "w-8 h-8" : "mr-2"} />
      {!floating && "Consultar por WhatsApp"}
    </Button>
  );
};
