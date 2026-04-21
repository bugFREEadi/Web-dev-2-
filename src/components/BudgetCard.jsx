import React from "react";
import { motion } from "framer-motion";
import { useCurrency } from "../hooks/useCurrency";

const BudgetCard = ({
  totalExpenses,
  remainingBudget,
  percentageUsed,
  budget,
  isBudgetExceeded,
}) => {
  const { formatCurrency } = useCurrency();

  const getProgressColor = () => {
    if (percentageUsed >= 100) return "bg-red-500";
    if (percentageUsed >= 80) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getAlertColor = () => {
    if (isBudgetExceeded) return "bg-red-50 border-red-200";
    if (percentageUsed >= 80) return "bg-yellow-50 border-yellow-200";
    return "bg-green-50 border-green-200";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-white p-6 rounded-lg shadow-md border-2 ${getAlertColor()}`}
    >
      <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Budget</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Budget</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(budget)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Spent</p>
          <p className="text-2xl font-bold text-red-600">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-600 text-sm mb-1">Remaining</p>
          <p
            className={`text-2xl font-bold ${remainingBudget < 0 ? "text-red-600" : "text-green-600"}`}
          >
            {formatCurrency(remainingBudget)}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-gray-700">Usage</span>
          <span className="text-sm font-bold text-gray-700">
            {percentageUsed.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(percentageUsed, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full ${getProgressColor()} transition`}
          />
        </div>
      </div>

      {isBudgetExceeded && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-semibold">⚠️ Budget Exceeded!</p>
          <p className="text-sm">
            You've exceeded your monthly budget by{" "}
            {formatCurrency(Math.abs(remainingBudget))}
          </p>
        </div>
      )}

      {percentageUsed >= 80 && !isBudgetExceeded && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p className="font-semibold">⚠️ Budget Warning</p>
          <p className="text-sm">
            You're at {percentageUsed.toFixed(1)}% of your monthly budget
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BudgetCard;
