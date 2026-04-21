// App Constants

export const CATEGORIES = [
  "Food",
  "Travel",
  "Rent",
  "Shopping",
  "Entertainment",
  "Health",
  "Utilities",
  "Subscriptions",
];

export const TRANSACTION_TYPES = ["income", "expense"];

export const SORT_OPTIONS = [
  { value: "date-desc", label: "Latest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "amount-asc", label: "Amount (Low to High)" },
  { value: "amount-desc", label: "Amount (High to Low)" },
];

export const DEFAULT_BUDGET = 50000; // Default monthly budget in INR

export const CURRENCY_CODE = "INR";
export const CURRENCY_SYMBOL = "₹";

export const TOAST_CONFIG = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const DEBOUNCE_DELAY = 500; // 500ms for search debouncing

export const CHART_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#FFA07A",
  "#98D8C8",
  "#F7DC6F",
  "#BB8FCE",
  "#85C1E2",
];

export const BUDGET_WARNINGS = {
  WARNING_THRESHOLD: 80, // 80% of budget
  ERROR_THRESHOLD: 100, // 100% of budget (exceeded)
};

export const DATE_FORMAT = {
  SHORT: "dd/MM/yyyy",
  LONG: "EEEE, MMMM dd, yyyy",
  TIME: "HH:mm:ss",
  FULL: "EEEE, MMMM dd, yyyy HH:mm:ss",
};

export const API_ENDPOINTS = {
  EXCHANGE_RATE: "https://api.exchangerate-api.com/v4/latest/INR",
  NEWS_API: "https://newsapi.org/v2/everything",
};

export const STORAGE_KEYS = {
  FINANCE_STATE: "financeState",
  USER_PREFERENCES: "userPreferences",
};

// Feature Flags
export const FEATURES = {
  ENABLE_ANALYTICS: true,
  ENABLE_BUDGET_TRACKING: true,
  ENABLE_RECURRING_TRANSACTIONS: true,
  ENABLE_EXPORT: false, // Coming soon
  ENABLE_DARK_MODE: false, // Coming soon
  ENABLE_AUTHENTICATION: false, // Coming soon
};
