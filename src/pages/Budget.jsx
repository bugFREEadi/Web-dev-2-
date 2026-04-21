import React, { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useBudget } from "../hooks/useBudget";
import { useCurrency } from "../hooks/useCurrency";
import BudgetCard from "../components/BudgetCard";
import PieChartComponent from "../components/Charts/PieChart";

const Budget = () => {
  const { budget, setBudget, monthlyMetrics, getCategorySpending } =
    useBudget();
  const { formatCurrency } = useCurrency();
  const [inputBudget, setInputBudget] = useState(budget.toString());
  const [isEditing, setIsEditing] = useState(false);

  const handleBudgetUpdate = () => {
    const newBudget = parseFloat(inputBudget);
    if (isNaN(newBudget) || newBudget <= 0) {
      toast.error("Please enter a valid budget amount");
      return;
    }
    setBudget(newBudget);
    setIsEditing(false);
    toast.success("Budget updated successfully!");
  };

  const categoryData = Object.entries(getCategorySpending).map(
    ([category, amount]) => ({
      name: category,
      value: Math.round(amount * 100) / 100,
    }),
  );

  const categoryStats = Object.entries(getCategorySpending)
    .map(([category, amount]) => ({
      category,
      amount: Math.round(amount * 100) / 100,
      percentage:
        monthlyMetrics.totalExpenses > 0
          ? ((amount / monthlyMetrics.totalExpenses) * 100).toFixed(1)
          : 0,
    }))
    .sort((a, b) => b.amount - a.amount);

  const StatCard = ({ label, value, subtext, color = "primary" }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white p-6 rounded-lg shadow-md border-t-4 border-${color}`}
    >
      <p className="text-gray-600 text-sm mb-2">{label}</p>
      <p className={`text-3xl font-bold text-${color} mb-1`}>{value}</p>
      {subtext && <p className="text-gray-500 text-sm">{subtext}</p>}
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Budget Management
        </h1>
        <p className="text-gray-600">Set and track your monthly budget</p>
      </motion.div>

      {/* Budget Update Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-r from-primary to-primary/80 text-white p-8 rounded-lg shadow-lg"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Monthly Budget: {formatCurrency(budget)}
          </h2>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setInputBudget(budget.toString());
            }}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
          >
            {isEditing ? "Cancel" : "Update Budget"}
          </button>
        </div>

        {isEditing && (
          <div className="flex gap-2">
            <input
              type="number"
              value={inputBudget}
              onChange={(e) => setInputBudget(e.target.value)}
              placeholder="Enter budget amount"
              className="flex-1 px-4 py-2 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              onClick={handleBudgetUpdate}
              className="px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Save
            </button>
          </div>
        )}
      </motion.div>

      {/* Budget Card */}
      <BudgetCard
        totalExpenses={monthlyMetrics.totalExpenses}
        remainingBudget={monthlyMetrics.remainingBudget}
        percentageUsed={monthlyMetrics.percentageUsed}
        budget={budget}
        isBudgetExceeded={monthlyMetrics.isBudgetExceeded}
      />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Monthly Budget"
          value={formatCurrency(budget)}
          color="primary"
        />
        <StatCard
          label="Total Spent"
          value={formatCurrency(monthlyMetrics.totalExpenses)}
          color="danger"
        />
        <StatCard
          label="Remaining"
          value={formatCurrency(monthlyMetrics.remainingBudget)}
          color={monthlyMetrics.remainingBudget >= 0 ? "success" : "danger"}
        />
        <StatCard
          label="Usage"
          value={`${monthlyMetrics.percentageUsed.toFixed(1)}%`}
          subtext={
            monthlyMetrics.percentageUsed > 100 ? "Over budget" : "On track"
          }
          color="primary"
        />
      </div>

      {/* Charts and Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <div className="lg:col-span-1">
          <PieChartComponent data={categoryData} title="Spending by Category" />
        </div>

        {/* Category Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Category Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    % of Total
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.length > 0 ? (
                  categoryStats.map((stat, index) => (
                    <motion.tr
                      key={stat.category}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-4 px-4 text-gray-700 font-medium">
                        {stat.category}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-700 font-semibold">
                        {formatCurrency(stat.amount)}
                      </td>
                      <td className="py-4 px-4 text-right text-gray-600">
                        {stat.percentage}%
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(stat.percentage, 100)}%`,
                            }}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="py-4 px-4 text-center text-gray-500"
                    >
                      No expenses recorded this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Tips Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          💡 Budget Tips
        </h3>
        <ul className="text-blue-800 space-y-2">
          <li>• Set a realistic monthly budget based on your income</li>
          <li>• Review your spending regularly to stay within budget</li>
          <li>• Track recurring expenses to avoid surprises</li>
          <li>• Allocate specific budgets for different categories</li>
          <li>• Build an emergency fund of 3-6 months of expenses</li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Budget;
