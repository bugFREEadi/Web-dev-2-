import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCurrency } from "../hooks/useCurrency";
import { formatDistanceToNow } from "date-fns";

const TransactionCard = ({ transaction, onDelete, onEdit }) => {
  const { formatCurrency, getCategoryColor, getTypeColor } = useCurrency();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border-l-4 border-primary"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(transaction.category)}`}
            >
              {transaction.category}
            </span>
            {transaction.recurring && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                Recurring
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-800">{transaction.title}</h3>
          {transaction.notes && (
            <p className="text-sm text-gray-500 mt-1">{transaction.notes}</p>
          )}
        </div>
        <div className="text-right ml-4">
          <p className={`text-lg font-bold ${getTypeColor(transaction.type)}`}>
            {transaction.type === "income" ? "+" : "-"}
            {formatCurrency(transaction.amount)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {formatDistanceToNow(new Date(transaction.date), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <Link
          to={`/transactions/edit/${transaction.id}`}
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded transition"
        >
          Edit
        </Link>
        <button
          onClick={() => onDelete(transaction.id)}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded transition"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default TransactionCard;
