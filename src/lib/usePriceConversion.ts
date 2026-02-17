import { useCurrency } from './currency-context';

/**
 * Hook for price conversion - Use this in pages that need currency conversion
 * DO NOT use in booking/payment pages - they should always show PHP prices
 */
export const usePriceConversion = () => {
  const { convertPrice, formatPrice, selectedCountry } = useCurrency();

  return {
    convertPrice,
    formatPrice,
    currencySymbol: selectedCountry?.symbol || '₱',
    currencyCode: selectedCountry?.currency || 'PHP',
  };
};
