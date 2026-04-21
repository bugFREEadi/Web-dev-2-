import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const LineChartComponent = ({
  data,
  title = "Monthly Trend",
  dataKey = "amount",
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
          <LineChart data={chartData}>
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
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ fill: "#6366f1", r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-72 flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </motion.div>
  );
};

export default LineChartComponent;
