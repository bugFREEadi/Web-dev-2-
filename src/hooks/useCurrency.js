import {
  formatCurrency,
  formatNumber,
  getTypeColor,
  getCategoryColor,
} from "../utils/currencyFormatter";

export const useCurrency = () => {
  return {
    formatCurrency,
    formatNumber,
    getTypeColor,
    getCategoryColor,
  };
};
