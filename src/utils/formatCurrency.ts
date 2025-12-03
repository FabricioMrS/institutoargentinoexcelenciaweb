/**
 * Formatea un número como moneda argentina (sin decimales, punto como separador de miles)
 * Ejemplo: 10000 -> "10.000"
 */
export const formatCurrency = (value: number): string => {
  const rounded = Math.round(value);
  return rounded.toLocaleString('es-AR', { 
    maximumFractionDigits: 0,
    minimumFractionDigits: 0 
  });
};
