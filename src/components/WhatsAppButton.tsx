import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  floating?: boolean;
}

export const WhatsAppButton = ({ 
  message = "¡Hola! Estoy interesado en conocer más sobre los cursos.",
  floating = false 
}: WhatsAppButtonProps) => {
  const whatsappNumber = "543518118268";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  const baseClasses = "bg-green-500 hover:bg-green-600 text-white transition-all duration-300 ease-in-out";
  const floatingClasses = floating ? 
    "fixed bottom-6 right-6 rounded-full w-16 h-16 shadow-lg hover:shadow-xl z-50" : 
    "w-full";

  return (
    <Button 
      className={`${baseClasses} ${floatingClasses}`}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className={floating ? "w-8 h-8" : "mr-2"} />
      {!floating && "Consultar por WhatsApp"}
    </Button>
  );
};