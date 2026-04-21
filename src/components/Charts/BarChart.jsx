import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const BarChartComponent = ({
  data,
  title = "Income vs Expense",
  dataKey1 = "income",
  dataKey2 = "expense",
}) => {
  const chartData = data && data.length > 0 ? data : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₹${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend />
            <Bar dataKey={dataKey1} fill="#10b981" name="Income" />
            <Bar dataKey={dataKey2} fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </motion.div>
  );
};

export default BarChartComponent;
