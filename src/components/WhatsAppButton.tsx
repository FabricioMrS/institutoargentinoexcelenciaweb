import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
}

export const WhatsAppButton = ({ message = "¡Hola! Estoy interesado en conocer más sobre los cursos." }: WhatsAppButtonProps) => {
  const whatsappNumber = "543518118268";
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  return (
    <Button 
      className="bg-green-500 hover:bg-green-600 text-white w-full"
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className="mr-2" />
      Consultar por WhatsApp
    </Button>
  );
};