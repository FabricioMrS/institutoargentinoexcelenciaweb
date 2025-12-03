import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

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
  
  const phoneNumber = "5493512069382"; // reemplazar por tu número real

  const getWhatsAppMessage = () => {
    if (courseTitle && price && selectedInstallments) {
      const basePrice = Number(price);
      const finalPrice = interestRate > 0 
        ? basePrice * (1 + interestRate / 100)
        : basePrice;

      const installmentValue = finalPrice / selectedInstallments;

      return `Hola! Me interesa el curso "${courseTitle}".

Precio final: $${formatCurrency(finalPrice)}
En ${selectedInstallments} cuotas de $${formatCurrency(installmentValue)} cada una.
Interés aplicado: ${interestRate}%

¿Podrían darme más información?`;
    }

    return message || "Hola! Me gustaría obtener más información sobre sus cursos.";
  };


  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    const text = encodeURIComponent(getWhatsAppMessage());
    const mobileLink = `whatsapp://send?phone=${phoneNumber}&text=${text}`;
    const desktopLink = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${text}`;
    const fallbackLink = `https://wa.me/${phoneNumber}?text=${text}`;

    // Detectar si es móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    if (isMobile) {
      // Intentar abrir app móvil
      window.location.href = mobileLink;

      // Si falla, abrir wa.me (funciona SIEMPRE)
      setTimeout(() => {
        window.location.href = fallbackLink;
      }, 700);
    } else {
      // PC → WhatsApp Web
      window.open(desktopLink, "_blank", "noopener,noreferrer");
    }
  };

  const baseClasses = "bg-green-500 hover:bg-green-600 text-white";
  const floatingClasses = floating
    ? "fixed bottom-4 right-4 rounded-full w-16 h-16 shadow-lg z-50"
    : "w-full";

  return (
    <Button className={`${baseClasses} ${floatingClasses}`} onClick={handleClick}>
      <MessageCircle className={floating ? "w-8 h-8" : "mr-2"} />
      {!floating && "Consultar por WhatsApp"}
    </Button>
  );
};
