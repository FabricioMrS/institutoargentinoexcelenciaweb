import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  message?: string;
  floating?: boolean;
  courseTitle?: string;
  selectedInstallments?: number;
  price?: string;
}

export const WhatsAppButton = ({ 
  message,
  floating = false,
  courseTitle,
  selectedInstallments,
  price
}: WhatsAppButtonProps) => {
  const whatsappNumber = "543518118268";
  
  const generateMessage = () => {
    if (message) return message;
    
    let defaultMessage = "¡Hola! Estoy interesado en conocer más sobre";
    
    if (courseTitle) {
      defaultMessage += ` el curso "${courseTitle}"`;
      if (selectedInstallments && price) {
        const numericPrice = Number(price.replace(/[^0-9]/g, ''));
        const monthlyAmount = (numericPrice * (selectedInstallments > 1 ? 1.15 : 1)) / selectedInstallments;
        defaultMessage += ` con la financiación de ${selectedInstallments} ${selectedInstallments === 1 ? 'pago' : 'cuotas'} de $${monthlyAmount.toFixed(2)}`;
      }
    } else {
      defaultMessage += " los cursos";
    }
    
    return defaultMessage;
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(generateMessage());
    // Using web.whatsapp.com for desktop and api.whatsapp.com for mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const baseUrl = isMobile ? 'https://api.whatsapp.com' : 'https://web.whatsapp.com';
    const whatsappUrl = `${baseUrl}/send?phone=${whatsappNumber}&text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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