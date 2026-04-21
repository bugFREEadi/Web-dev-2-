// Format currency to INR with proper formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format large numbers with K, M, B suffix
export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toFixed(2);
};

// Get color based on transaction type
export const getTypeColor = (type) => {
  return type === "income" ? "text-green-600" : "text-red-600";
};

// Get background color based on category
export const getCategoryColor = (category) => {
  const colors = {
    Food: "bg-orange-100 text-orange-800",
    Travel: "bg-blue-100 text-blue-800",
    Rent: "bg-red-100 text-red-800",
    Shopping: "bg-pink-100 text-pink-800",
    Entertainment: "bg-purple-100 text-purple-800",
    Health: "bg-green-100 text-green-800",
    Utilities: "bg-yellow-100 text-yellow-800",
    Subscriptions: "bg-indigo-100 text-indigo-800",
  };
  return colors[category] || "bg-gray-100 text-gray-800";
};
