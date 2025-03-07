
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CourseFinancingProps {
  courseTitle: string;
  price: string;
  courseId?: string;
}

interface FinancingOption {
  installments: number;
  interest_rate: number;
}

export const CourseFinancing = ({
  courseTitle,
  price,
  courseId
}: CourseFinancingProps) => {
  const [selectedInstallments, setSelectedInstallments] = useState(1);
  const [sendViaWhatsApp, setSendViaWhatsApp] = useState(false);
  const [selectedFinancing, setSelectedFinancing] = useState<string>("");
  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([
    { installments: 1, interest_rate: 0 },
  ]);

  const { data: courseFinancingOptions, isLoading } = useQuery({
    queryKey: ['financing-options', courseId],
    queryFn: async () => {
      if (!courseId) return null;
      console.log("Fetching financing options for course:", courseId);
      const { data, error } = await supabase
        .from('course_financing_options')
        .select('*')
        .eq('course_id', courseId);

      if (error) {
        console.error("Error fetching financing options:", error);
        throw error;
      }
      console.log("Financing options retrieved:", data);
      return data;
    },
    enabled: !!courseId,
  });

  useEffect(() => {
    if (courseFinancingOptions && courseFinancingOptions.length > 0) {
      console.log("Setting financing options:", courseFinancingOptions);
      // Sort financing options by installments to ensure consistent display order
      const sortedOptions = [...courseFinancingOptions].sort((a, b) => 
        a.installments - b.installments
      );
      
      setFinancingOptions(sortedOptions.map(option => ({
        installments: option.installments,
        interest_rate: option.interest_rate
      })));
      
      // Set default option
      setSelectedInstallments(sortedOptions[0].installments);
      calculateInstallment(sortedOptions[0].installments);
    } else {
      // Make sure we always have at least the 1 payment option
      console.log("No custom financing options found, using default single payment option");
      setFinancingOptions([
        { installments: 1, interest_rate: 0 },
      ]);
      setSelectedInstallments(1);
      calculateInstallment(1);
    }
  }, [courseFinancingOptions]);

  const calculateInstallment = (months: number) => {
    const numericPrice = Number(price.replace(/[^0-9]/g, ''));
    const option = financingOptions.find(o => o.installments === months);
    
    if (option) {
      const totalAmount = numericPrice * (1 + option.interest_rate / 100);
      const monthlyAmount = totalAmount / option.installments;
      
      setSelectedFinancing(
        `${months} cuota${months > 1 ? 's' : ''} de $${monthlyAmount.toFixed(2)}`
      );
    }
  };

  const handleInstallmentChange = (months: number) => {
    setSelectedInstallments(months);
    calculateInstallment(months);
  };

  if (isLoading) {
    return <div className="mt-4">Cargando opciones de financiación...</div>;
  }

  return (
    <div className="mt-4">
      <h3 className="font-semibold mb-2">Opciones de financiación</h3>
      {financingOptions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {financingOptions.map(({ installments, interest_rate }) => (
            <Button
              key={installments}
              variant={selectedInstallments === installments ? "default" : "outline"}
              onClick={() => handleInstallmentChange(installments)}
              className="flex-1 min-w-[100px] text-sm md:text-base"
            >
              {installments} {installments === 1 ? 'pago' : 'cuotas'}
              {interest_rate > 0 && ` (+${interest_rate}%)`}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No hay opciones de financiación configuradas.</p>
      )}
      
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
