import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useState } from "react";

interface CourseFinancingProps {
  courseTitle: string;
  price: string;
  selectedInstallments: number;
  setSelectedInstallments: (value: number) => void;
  sendViaWhatsApp: boolean;
  setSendViaWhatsApp: (value: boolean) => void;
}

export const CourseFinancing = ({
  courseTitle,
  price,
  selectedInstallments,
  setSelectedInstallments,
  sendViaWhatsApp,
  setSendViaWhatsApp
}: CourseFinancingProps) => {
  const [selectedFinancing, setSelectedFinancing] = useState<string>("");

  const calculateInstallments = (price: string) => {
    const numericPrice = Number(price.replace(/[^0-9]/g, ''));
    const installmentOptions = [
      { months: 1, interest: 0 },
      { months: 3, interest: 0.15 },
      { months: 6, interest: 0.30 },
    ];

    return installmentOptions.map(option => {
      const totalAmount = numericPrice * (1 + option.interest);
      const monthlyAmount = totalAmount / option.months;
      return {
        months: option.months,
        monthlyAmount: monthlyAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
      };
    });
  };

  const handleInstallmentChange = (months: number) => {
    setSelectedInstallments(months);
    const installments = calculateInstallments(price);
    const selected = installments.find(i => i.months === months);
    
    if (selected) {
      setSelectedFinancing(
        `${months} cuota${months > 1 ? 's' : ''} de $${selected.monthlyAmount}`
      );
    }
  };

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Opciones de financiación</h3>
      <div className="flex gap-2">
        {calculateInstallments(price).map(({ months, monthlyAmount }) => (
          <Button
            key={months}
            variant={selectedInstallments === months ? "default" : "outline"}
            onClick={() => handleInstallmentChange(months)}
          >
            {months} {months === 1 ? 'pago' : 'cuotas'}
          </Button>
        ))}
      </div>
      
      {selectedFinancing && (
        <div className="mt-4 p-3 bg-comment-light dark:bg-comment-dark rounded-md">
          <p className="text-sm">
            Has seleccionado: {selectedFinancing} para el curso "{courseTitle}"
          </p>
        </div>
      )}

      {selectedInstallments > 0 && (
        <div className="mt-4 flex items-center space-x-2">
          <Checkbox
            id={`whatsapp-${courseTitle}`}
            checked={sendViaWhatsApp}
            onCheckedChange={(checked) => setSendViaWhatsApp(checked as boolean)}
          />
          <label
            htmlFor={`whatsapp-${courseTitle}`}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enviar vía WhatsApp
          </label>
        </div>
      )}
      
      {sendViaWhatsApp && (
        <div className="mt-4">
          <WhatsAppButton 
            courseTitle={courseTitle}
            selectedInstallments={selectedInstallments}
            price={price}
          />
        </div>
      )}
    </div>
  );
};