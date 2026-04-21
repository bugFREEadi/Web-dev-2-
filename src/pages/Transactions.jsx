import React, { useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useTransactions } from "../hooks/useTransactions";
import { useCurrency } from "../hooks/useCurrency";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import TransactionCard from "../components/TransactionCard";

const Transactions = () => {
  const { transactions, deleteTransaction, searchTransactions } =
    useTransactions();
  const { formatCurrency } = useCurrency();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const [sortBy, setSortBy] = useState("date-desc");

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let result = searchTerm ? searchTransactions(searchTerm) : transactions;

    // Apply category filter
    if (filters.category) {
      result = result.filter((t) => t.category === filters.category);
    }

    // Apply type filter
    if (filters.type) {
      result = result.filter((t) => t.type === filters.type);
    }

    // Apply date range filter
    if (filters.startDate) {
      result = result.filter(
        (t) => new Date(t.date) >= new Date(filters.startDate),
      );
    }
    if (filters.endDate) {
      result = result.filter(
        (t) => new Date(t.date) <= new Date(filters.endDate),
      );
    }

    // Apply sorting
    switch (sortBy) {
      case "date-asc":
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        result.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "amount-asc":
        result.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
        break;
      case "amount-desc":
        result.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
        break;
      default:
        break;
    }

    return result;
  }, [transactions, searchTerm, filters, sortBy, searchTransactions]);

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Are you sure you want to delete this transaction?")) {
        deleteTransaction(id);
        toast.success("Transaction deleted successfully");
      }
    },
    [deleteTransaction],
  );

  const totalAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0,
    );
  }, [filteredTransactions]);

  const EmptyState = () => (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg mb-4">No transactions found</p>
      <Link
        to="/transactions/new"
        className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition"
      >
        Create First Transaction
      </Link>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">Manage all your transactions here</p>
        </div>
        <Link
          to="/transactions/new"
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition"
        >
          + Add Transaction
        </Link>
      </motion.div>

      {/* Search and Filters */}
      <SearchBar
        onSearch={setSearchTerm}
        placeholder="Search by title or notes..."
      />
      <Filters onFilterChange={setFilters} />

      {/* Sorting and Stats */}
      {filteredTransactions.length > 0 && (
        <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <div>
            <p className="text-gray-600">
              {filteredTransactions.length} transaction
              {filteredTransactions.length !== 1 ? "s" : ""} found
            </p>
            <p className="text-lg font-bold text-gray-800">
              Total: {formatCurrency(totalAmount)}
            </p>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-asc">Amount (Low to High)</option>
            <option value="amount-desc">Amount (High to Low)</option>
          </select>
        </div>
      )}

      {/* Transactions List */}
      {filteredTransactions.length > 0 ? (
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {filteredTransactions.map((transaction, index) => (
            <TransactionCard
              key={transaction.id}
              transaction={transaction}
              onDelete={handleDelete}
              onEdit={() => {}}
            />
          ))}
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default Transactions;
