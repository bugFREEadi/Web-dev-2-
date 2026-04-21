import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import { FinanceProvider } from "./context/FinanceContext";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import AddTransaction from "./pages/AddTransaction";
import Budget from "./pages/Budget";
import Analytics from "./pages/Analytics";

function App() {
  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/transactions", label: "Transactions", icon: "💸" },
    { path: "/budget", label: "Budget", icon: "💰" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
  ];

  return (
    <FinanceProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation */}
          <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link
                  to="/"
                  className="text-2xl font-bold text-primary hover:text-primary/90 transition flex items-center gap-2"
                >
                  💳 Finance Tracker
                </Link>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-1">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition font-medium flex items-center gap-1"
                    >
                      <span>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                  <details className="dropdown">
                    <summary className="btn btn-ghost">
                      <span className="text-xl">☰</span>
                    </summary>
                    <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      {navItems.map((item) => (
                        <li key={item.path}>
                          <Link to={item.path} className="text-gray-700">
                            <span>{item.icon}</span>
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transactions/new" element={<AddTransaction />} />
              <Route
                path="/transactions/edit/:id"
                element={<AddTransaction />}
              />
              <Route path="/budget" element={<Budget />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-gray-100 mt-16 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-gray-600">
                <p>
                  © 2024 Personal Finance Tracker. Build with ❤️ for better
                  financial management.
                </p>
              </div>
            </div>
          </footer>

          {/* Toast Notifications */}
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </FinanceProvider>
  );
}

export default App;
