import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useTransactions } from "../hooks/useTransactions";

const CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Subscriptions",
];
const TYPES = ["income", "expense"];

// Validation schema
const validationSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive"),
  category: yup.string().required("Category is required"),
  type: yup.string().required("Type is required"),
  date: yup.string().required("Date is required"),
  notes: yup.string(),
  recurring: yup.boolean(),
});

const AddTransaction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { transactions, addTransaction, updateTransaction } = useTransactions();
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      title: "",
      amount: "",
      category: CATEGORIES[0],
      type: TYPES[0],
      date: new Date().toISOString().split("T")[0],
      notes: "",
      recurring: false,
    },
  });

  const watchType = watch("type");

  useEffect(() => {
    if (isEditMode) {
      const transaction = transactions.find((t) => t.id === id);
      if (transaction) {
        reset({
          title: transaction.title,
          amount: transaction.amount,
          category: transaction.category,
          type: transaction.type,
          date: transaction.date,
          notes: transaction.notes || "",
          recurring: transaction.recurring || false,
        });
      }
    }
  }, [id, isEditMode, transactions, reset]);

  const onSubmit = (data) => {
    try {
      if (isEditMode) {
        updateTransaction(id, data);
        toast.success("Transaction updated successfully!");
      } else {
        addTransaction(data);
        toast.success("Transaction added successfully!");
      }
      navigate("/transactions");
    } catch (error) {
      toast.error("Error saving transaction");
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {isEditMode ? "Edit Transaction" : "Add New Transaction"}
        </h1>
        <p className="text-gray-600">
          {isEditMode
            ? "Update your transaction details"
            : "Create a new transaction to track your finances"}
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-lg shadow-md space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            {...register("title")}
            placeholder="e.g., Grocery Shopping"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>

        {/* Amount and Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              {...register("amount")}
              placeholder="0.00"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type *
            </label>
            <select
              {...register("type")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
            )}
          </div>
        </div>

        {/* Category and Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              {...register("category")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              {...register("date")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            {...register("notes")}
            placeholder="Add additional notes (optional)"
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          ></textarea>
        </div>

        {/* Recurring */}
        <div className="flex items-center">
          <input
            type="checkbox"
            {...register("recurring")}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
          />
          <label className="ml-3 block text-sm font-medium text-gray-700">
            Mark as recurring
          </label>
        </div>

        {/* Type-specific message */}
        {watchType === "income" && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            <p className="text-sm">
              💰 Income transaction - This will increase your balance
            </p>
          </div>
        )}

        {watchType === "expense" && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <p className="text-sm">
              💸 Expense transaction - This will decrease your balance
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition"
          >
            {isEditMode ? "Update Transaction" : "Add Transaction"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/transactions")}
            className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default AddTransaction;
