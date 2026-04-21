import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";

export const FinanceContext = createContext();

const initialState = {
  transactions: [],
  budget: 50000,
};

const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
      };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    case "SET_BUDGET":
      return {
        ...state,
        budget: action.payload,
      };
    default:
      return state;
  }
};

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    transactionReducer,
    initialState,
    (initial) => {
      const savedState = localStorage.getItem("financeState");
      return savedState ? JSON.parse(savedState) : initial;
    },
  );

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem("financeState", JSON.stringify(state));
  }, [state]);

  const addTransaction = useCallback((transaction) => {
    const newTransaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_TRANSACTION", payload: newTransaction });
    return newTransaction;
  }, []);

  const updateTransaction = useCallback((id, updatedTransaction) => {
    dispatch({
      type: "UPDATE_TRANSACTION",
      payload: { id, ...updatedTransaction },
    });
  }, []);

  const deleteTransaction = useCallback((id) => {
    dispatch({ type: "DELETE_TRANSACTION", payload: id });
  }, []);

  const setBudget = useCallback((amount) => {
    dispatch({ type: "SET_BUDGET", payload: amount });
  }, []);

  const value = {
    transactions: state.transactions,
    budget: state.budget,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    setBudget,
  };

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
};
