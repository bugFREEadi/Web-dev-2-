import { useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";

export const useTransactions = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useTransactions must be used within FinanceProvider");
  }

  const getTransactionsByCategory = (category) => {
    return context.transactions.filter((t) => t.category === category);
  };

  const getTransactionsByType = (type) => {
    return context.transactions.filter((t) => t.type === type);
  };

  const getTransactionsByDateRange = (startDate, endDate) => {
    return context.transactions.filter((t) => {
      const tDate = new Date(t.date);
      return tDate >= startDate && tDate <= endDate;
    });
  };

  const getRecurringTransactions = () => {
    return context.transactions.filter((t) => t.recurring);
  };

  const searchTransactions = (query) => {
    const lowerQuery = query.toLowerCase();
    return context.transactions.filter(
      (t) =>
        t.title.toLowerCase().includes(lowerQuery) ||
        (t.notes && t.notes.toLowerCase().includes(lowerQuery)),
    );
  };

  return {
    transactions: context.transactions,
    addTransaction: context.addTransaction,
    updateTransaction: context.updateTransaction,
    deleteTransaction: context.deleteTransaction,
    getTransactionsByCategory,
    getTransactionsByType,
    getTransactionsByDateRange,
    getRecurringTransactions,
    searchTransactions,
  };
};
