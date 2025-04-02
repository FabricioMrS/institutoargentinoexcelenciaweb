
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
  const whatsappNumber = "543518118268";
  
  const generateMessage = () => {
    if (message) return message;
    
    let defaultMessage = "¡Hola! Estoy interesado en conocer más sobre";
    
    if (courseTitle) {
      defaultMessage += ` el curso "${courseTitle}"`;
      if (selectedInstallments && price) {
        const numericPrice = Number(price.replace(/[^0-9]/g, ''));
        const totalAmount = numericPrice * (1 + interestRate / 100);
        const monthlyAmount = totalAmount / selectedInstallments;
        
        defaultMessage += ` con la financiación de ${selectedInstallments} ${selectedInstallments === 1 ? 'pago' : 'cuotas'} de $${monthlyAmount.toFixed(2)}`;
      }
    } else {
      defaultMessage += " los cursos";
    }
    
    return defaultMessage;
  };

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(generateMessage());
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      window.location.href = `whatsapp://send?phone=${whatsappNumber}&text=${encodedMessage}`;
    } else {
      window.open(`https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodedMessage}`, '_blank');
    }
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
