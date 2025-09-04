
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
  const phoneNumber = "5491123456789"; // Reemplaza con tu número real
  
  const getWhatsAppMessage = () => {
    if (courseTitle && price && selectedInstallments) {
      return `Hola! Me interesa el curso "${courseTitle}" con precio ${price} en ${selectedInstallments} cuotas${interestRate > 0 ? ` (${interestRate}% interés)` : ''}. ¿Podrían darme más información?`;
    }
    return message || "Hola! Me gustaría obtener más información sobre sus cursos.";
  };

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(getWhatsAppMessage())}`;
  
  // Abrimos en nueva pestaña vía <a target="_blank"> para evitar bloqueo por X-Frame-Options

  const baseClasses = "bg-green-500 hover:bg-green-600 text-white";
  const floatingClasses = floating ? 
    "fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg z-50" : 
    "w-full";

  return (
    <Button asChild className={`${baseClasses} ${floatingClasses}`}>
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" aria-label={floating ? "Abrir WhatsApp" : "Consultar por WhatsApp"}>
        <MessageCircle className={floating ? "w-8 h-8" : "mr-2"} />
        {!floating && "Consultar por WhatsApp"}
      </a>
    </Button>
  );
};
