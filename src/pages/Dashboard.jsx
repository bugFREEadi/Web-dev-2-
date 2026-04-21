import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../hooks/useTransactions";
import { useBudget } from "../hooks/useBudget";
import { useCurrency } from "../hooks/useCurrency";
import {
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  eachMonthOfInterval,
  subMonths,
  format,
} from "date-fns";
import BudgetCard from "../components/BudgetCard";
import PieChartComponent from "../components/Charts/PieChart";
import LineChartComponent from "../components/Charts/LineChart";
import BarChartComponent from "../components/Charts/BarChart";

const Dashboard = () => {
  const { transactions } = useTransactions();
  const { budget, monthlyMetrics, getCategorySpending, getTopCategory } =
    useBudget();
  const { formatCurrency } = useCurrency();

  // Prepare data for charts
  const categoryData = useMemo(() => {
    return Object.entries(getCategorySpending).map(([category, amount]) => ({
      name: category,
      value: Math.round(amount * 100) / 100,
    }));
  }, [getCategorySpending]);

  const monthlyTrendData = useMemo(() => {
    const months = eachMonthOfInterval({
      start: subMonths(new Date(), 11),
      end: new Date(),
    });

    return months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);

      const monthTransactions = transactions.filter((t) =>
        isWithinInterval(new Date(t.date), {
          start: monthStart,
          end: monthEnd,
        }),
      );

      const income = monthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      const expense = monthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);

      return {
        month: format(month, "MMM"),
        income: Math.round(income * 100) / 100,
        expense: Math.round(expense * 100) / 100,
        net: Math.round((income - expense) * 100) / 100,
      };
    });
  }, [transactions]);

  const MetricCard = ({ label, value, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-${color}`}
    >
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold text-${color}`}>{value}</p>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back! Here's your financial overview.
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Income"
          value={formatCurrency(monthlyMetrics.totalIncome)}
          color="success"
        />
        <MetricCard
          label="Total Expenses"
          value={formatCurrency(monthlyMetrics.totalExpenses)}
          color="danger"
        />
        <MetricCard
          label="Net Balance"
          value={formatCurrency(monthlyMetrics.netBalance)}
          color={monthlyMetrics.netBalance >= 0 ? "success" : "danger"}
        />
        {getTopCategory && (
          <MetricCard
            label="Top Category"
            value={`${getTopCategory.category} (${formatCurrency(getTopCategory.amount)})`}
            color="primary"
          />
        )}
      </div>

      {/* Budget Card */}
      <BudgetCard
        totalExpenses={monthlyMetrics.totalExpenses}
        remainingBudget={monthlyMetrics.remainingBudget}
        percentageUsed={monthlyMetrics.percentageUsed}
        budget={budget}
        isBudgetExceeded={monthlyMetrics.isBudgetExceeded}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent data={categoryData} title="Spending by Category" />
        <BarChartComponent
          data={monthlyTrendData}
          dataKey1="income"
          dataKey2="expense"
        />
      </div>

      <LineChartComponent
        data={monthlyTrendData}
        title="12-Month Trend"
        dataKey="net"
      />
    </div>
  );
};

export default Dashboard;
