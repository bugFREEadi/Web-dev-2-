import { useMemo, useContext } from "react";
import { FinanceContext } from "../context/FinanceContext";
import { startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export const useBudget = () => {
  const { transactions, budget, setBudget } = useContext(FinanceContext);

  const monthlyMetrics = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter((t) =>
      isWithinInterval(new Date(t.date), {
        start: monthStart,
        end: monthEnd,
      }),
    );

    const totalIncome = monthlyTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalExpenses = monthlyTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const remainingBudget = budget - totalExpenses;
    const percentageUsed = budget > 0 ? (totalExpenses / budget) * 100 : 0;
    const netBalance = totalIncome - totalExpenses;

    return {
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      remainingBudget: Math.round(remainingBudget * 100) / 100,
      percentageUsed: Math.min(percentageUsed, 100),
      netBalance: Math.round(netBalance * 100) / 100,
      isBudgetExceeded: totalExpenses > budget,
    };
  }, [transactions, budget]);

  const getCategorySpending = useMemo(() => {
    const now = new Date();
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);

    const monthlyTransactions = transactions.filter(
      (t) =>
        t.type === "expense" &&
        isWithinInterval(new Date(t.date), {
          start: monthStart,
          end: monthEnd,
        }),
    );

    const spending = {};
    monthlyTransactions.forEach((t) => {
      spending[t.category] = (spending[t.category] || 0) + parseFloat(t.amount);
    });

    return spending;
  }, [transactions]);

  const getTopCategory = useMemo(() => {
    let topCategory = null;
    let maxSpent = 0;

    Object.entries(getCategorySpending).forEach(([category, amount]) => {
      if (amount > maxSpent) {
        maxSpent = amount;
        topCategory = { category, amount };
      }
    });

    return topCategory;
  }, [getCategorySpending]);

  return {
    budget,
    setBudget,
    monthlyMetrics,
    getCategorySpending,
    getTopCategory,
  };
};
