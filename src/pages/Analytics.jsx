import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTransactions } from "../hooks/useTransactions";
import { useCurrency } from "../hooks/useCurrency";
import {
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  isWithinInterval,
  subMonths,
  format,
} from "date-fns";
import PieChartComponent from "../components/Charts/PieChart";
import LineChartComponent from "../components/Charts/LineChart";
import BarChartComponent from "../components/Charts/BarChart";

const Analytics = () => {
  const { transactions, getRecurringTransactions } = useTransactions();
  const { formatCurrency, formatNumber } = useCurrency();

  // Monthly trend data
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

  // Category distribution
  const categoryDistribution = useMemo(() => {
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

    return Object.entries(spending).map(([category, amount]) => ({
      name: category,
      value: Math.round(amount * 100) / 100,
    }));
  }, [transactions]);

  // Statistics
  const stats = useMemo(() => {
    const totalTransactions = transactions.length;
    const totalIncome = transactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalExpenses = transactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);
    const totalRecurring = getRecurringTransactions().length;
    const averageTransaction =
      totalTransactions > 0
        ? (totalIncome + totalExpenses) / totalTransactions
        : 0;

    // Monthly average
    const monthlyAvgIncome = totalIncome / 12;
    const monthlyAvgExpense = totalExpenses / 12;

    return {
      totalTransactions,
      totalIncome: Math.round(totalIncome * 100) / 100,
      totalExpenses: Math.round(totalExpenses * 100) / 100,
      netBalance: Math.round((totalIncome - totalExpenses) * 100) / 100,
      totalRecurring,
      averageTransaction: Math.round(averageTransaction * 100) / 100,
      monthlyAvgIncome: Math.round(monthlyAvgIncome * 100) / 100,
      monthlyAvgExpense: Math.round(monthlyAvgExpense * 100) / 100,
    };
  }, [transactions, getRecurringTransactions]);

  const StatCard = ({ label, value, subtext, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-${color}`}
    >
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className={`text-2xl font-bold text-${color} mb-1`}>{value}</p>
      {subtext && <p className="text-gray-500 text-sm">{subtext}</p>}
    </motion.div>
  );

  const recurringTransactions = getRecurringTransactions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics</h1>
        <p className="text-gray-600">
          Detailed insights into your financial behavior
        </p>
      </motion.div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Transactions"
          value={stats.totalTransactions}
          color="primary"
        />
        <StatCard
          label="Total Income"
          value={formatCurrency(stats.totalIncome)}
          color="success"
        />
        <StatCard
          label="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          color="danger"
        />
        <StatCard
          label="Net Balance"
          value={formatCurrency(stats.netBalance)}
          color={stats.netBalance >= 0 ? "success" : "danger"}
        />
      </div>

      {/* Averages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Avg per Transaction"
          value={formatCurrency(stats.averageTransaction)}
          color="primary"
        />
        <StatCard
          label="Monthly Avg Income"
          value={formatCurrency(stats.monthlyAvgIncome)}
          subtext="Last 12 months"
          color="success"
        />
        <StatCard
          label="Monthly Avg Expense"
          value={formatCurrency(stats.monthlyAvgExpense)}
          subtext="Last 12 months"
          color="danger"
        />
        <StatCard
          label="Recurring"
          value={`${stats.totalRecurring}`}
          subtext="Transactions"
          color="primary"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartComponent
          data={categoryDistribution}
          title="Category Breakdown"
        />
        <BarChartComponent
          data={monthlyTrendData}
          dataKey1="income"
          dataKey2="expense"
        />
      </div>

      <LineChartComponent
        data={monthlyTrendData}
        title="12-Month Net Income Trend"
        dataKey="net"
      />

      {/* Recurring Transactions */}
      {recurringTransactions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🔄 Recurring Transactions ({recurringTransactions.length})
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recurringTransactions
                  .slice(0, 10)
                  .map((transaction, index) => (
                    <motion.tr
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        {transaction.title}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {transaction.category}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${
                            transaction.type === "income"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type.charAt(0).toUpperCase() +
                            transaction.type.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-gray-700">
                        {transaction.type === "income" ? "+" : "-"}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </motion.tr>
                  ))}
              </tbody>
            </table>
            {recurringTransactions.length > 10 && (
              <p className="text-center text-gray-500 text-sm mt-4">
                ... and {recurringTransactions.length - 10} more recurring
                transactions
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Top Category */}
        {categoryDistribution.length > 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Top Category
            </h3>
            <p className="text-3xl font-bold text-blue-700">
              {categoryDistribution[0].name}
            </p>
            <p className="text-blue-600 mt-1">
              {formatCurrency(categoryDistribution[0].value)}
            </p>
          </div>
        )}

        {/* Spending Insight */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-500">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">
            Spending Insight
          </h3>
          <p className="text-2xl font-bold text-purple-700">
            {formatNumber(stats.totalExpenses / (transactions.length || 1))}
          </p>
          <p className="text-purple-600 mt-1">Average per transaction</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
