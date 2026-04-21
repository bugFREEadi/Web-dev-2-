# 💳 Personal Finance & Expense Analytics App

A production-ready personal finance management application built with React and modern web technologies. Track expenses, set budgets, and analyze your spending patterns with beautiful charts and insights.

## 🎯 Features

### Core Features

- ✅ **Transaction Management**: Add, edit, and delete transactions with ease
- ✅ **Smart Search**: Real-time search with debouncing for optimal performance
- ✅ **Advanced Filters**: Filter by category, type, and date range
- ✅ **Flexible Sorting**: Sort transactions by date and amount
- ✅ **Budget Tracking**: Set monthly budgets and track spending progress
- ✅ **Recurring Expenses**: Mark transactions as recurring and track them separately
- ✅ **Analytics Dashboard**: Comprehensive insights into your finances

### Pages

1. **Dashboard** (`/`) - Overview with key metrics and charts
2. **Transactions** (`/transactions`) - View, search, and filter all transactions
3. **Add/Edit Transaction** (`/transactions/new`, `/transactions/edit/:id`) - Create and edit transactions
4. **Budget** (`/budget`) - Budget management and category spending breakdown
5. **Analytics** (`/analytics`) - Detailed financial analytics and insights

### Charts & Visualizations

- 📊 **Pie Chart**: Category-wise spending distribution
- 📈 **Line Chart**: 12-month trend analysis
- 📊 **Bar Chart**: Income vs Expense comparison

## 🛠 Tech Stack

### Frontend

- **React 18.2.0** - UI framework
- **React Router DOM 6.20.0** - Client-side routing
- **React Hook Form 7.48.0** - Form management
- **Yup 1.3.3** - Schema validation
- **Recharts 2.10.3** - Data visualization

### Styling

- **Tailwind CSS 3.3.6** - Utility-first CSS
- **Framer Motion 10.16.4** - Smooth animations

### State Management & Utilities

- **Context API** - Global state management
- **react-toastify 9.1.3** - Notifications
- **axios 1.6.2** - HTTP requests
- **date-fns 2.30.0** - Date manipulation
- **uuid 9.0.1** - Unique ID generation

### Build Tools

- **Vite 5.0.8** - Modern build tool
- **@vitejs/plugin-react 4.2.1** - React plugin for Vite

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Navigate to project directory**

   ```bash
   cd finance-tracker
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── SearchBar.jsx           # Search with debouncing
│   ├── Filters.jsx             # Advanced filtering
│   ├── TransactionCard.jsx     # Transaction display card
│   ├── BudgetCard.jsx          # Budget progress display
│   └── Charts/
│       ├── PieChart.jsx        # Category spending pie chart
│       ├── LineChart.jsx       # Monthly trend line chart
│       └── BarChart.jsx        # Income vs expense bar chart
├── pages/
│   ├── Dashboard.jsx           # Main dashboard
│   ├── Transactions.jsx        # Transactions list
│   ├── AddTransaction.jsx      # Add/Edit transaction form
│   ├── Budget.jsx              # Budget management
│   └── Analytics.jsx           # Detailed analytics
├── context/
│   └── FinanceContext.jsx      # Global state with Context API
├── hooks/
│   ├── useTransactions.js      # Transaction CRUD logic
│   ├── useBudget.js            # Budget calculations
│   ├── useDebounce.js          # Debounce utility
│   └── useCurrency.js          # Currency formatting
├── services/
│   └── api.js                  # API integration (Axios)
├── utils/
│   └── currencyFormatter.js    # Currency & formatting utilities
├── App.jsx                     # Main app with routing
├── main.jsx                    # React entry point
└── index.css                   # Global styles & Tailwind
```

## 🧠 State Management (Context API)

The `FinanceContext` manages:

- Transactions list
- Monthly budget
- CRUD operations for transactions
- localStorage persistence

```javascript
// Usage in components
const { transactions, addTransaction, updateTransaction, deleteTransaction } =
  useTransactions();
const { budget, setBudget, monthlyMetrics } = useBudget();
```

## 🪝 Custom Hooks

### `useTransactions()`

- `transactions` - Array of all transactions
- `addTransaction()` - Add new transaction
- `updateTransaction()` - Update existing transaction
- `deleteTransaction()` - Delete transaction
- `searchTransactions()` - Search by title/notes
- `getTransactionsByCategory()` - Filter by category
- `getTransactionsByType()` - Filter by type
- `getTransactionsByDateRange()` - Filter by date
- `getRecurringTransactions()` - Get recurring transactions

### `useBudget()`

- `budget` - Monthly budget amount
- `setBudget()` - Update budget
- `monthlyMetrics` - Income, expenses, balance, percentage
- `getCategorySpending` - Spending by category
- `getTopCategory` - Top spending category

### `useDebounce(value, delay)`

- Optimized search input with 500ms default delay

### `useCurrency()`

- `formatCurrency()` - Format to INR
- `formatNumber()` - Format large numbers (K, M, B)
- `getTypeColor()` - Color for transaction type
- `getCategoryColor()` - Color for category

## 📊 Data Format

### Transaction Object

```javascript
{
  id: "uuid-string",
  title: "Grocery Shopping",
  amount: 1500,
  category: "Food",
  type: "expense",
  date: "2024-01-15",
  notes: "Weekly groceries",
  recurring: false,
  createdAt: "2024-01-15T10:30:00Z"
}
```

## 🎨 UI/UX Features

- ✨ Smooth animations with Framer Motion
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎯 Clean and modern UI with Tailwind CSS
- 💬 Toast notifications for all actions
- ⚡ Optimized performance with debouncing and memoization
- 🌙 Light theme with elegant color scheme

## 🔒 Features Highlight

### Smart Search & Filters

- Real-time search with debouncing
- Multi-field filtering (category, type, date range)
- Sort by date or amount

### Budget Management

- Set custom monthly budget
- Visual progress bar
- Budget exceeded warnings
- Category-wise spending breakdown

### Analytics

- 12-month trend analysis
- Category distribution visualization
- Income vs expense comparison
- Monthly averages and insights
- Recurring transaction tracking

### Data Persistence

- All data saved to localStorage
- Automatic sync on changes
- No backend required (can be extended)

## 🚀 Performance Optimizations

- **Debounced Search**: 500ms delay to optimize search queries
- **Memoization**: useMemo for expensive calculations
- **useCallback**: Optimized function references
- **Code Splitting**: Lazy loading supported via React Router
- **Asset Optimization**: Vite's automatic minification

## 🔧 API Integration

The app includes axios setup for optional API integrations:

```javascript
// Currency Exchange API
import { currencyService } from "./services/api";
await currencyService.convertCurrency(amount, targetCurrency);

// Financial News API
import { newsService } from "./services/api";
const articles = await newsService.getFinancialNews();
```

To use these APIs:

1. Get your API keys from [exchangerate-api.com](https://www.exchangerate-api.com) and [newsapi.org](https://newsapi.org)
2. Update the API_KEY constants in `src/services/api.js`

## 📱 Mobile Responsive

- Fully responsive grid layouts
- Mobile-optimized navigation
- Touch-friendly buttons and inputs
- Responsive charts and tables

## 🎓 Code Quality

- Clean and modular component structure
- Reusable custom hooks
- Proper separation of concerns
- Meaningful variable and function names
- Comments for complex logic
- No prop drilling with Context API

## 🧪 Testing Considerations

The app is structured for easy testing:

- Custom hooks can be tested independently
- Components are isolated and reusable
- Context API for state management
- API calls are centralized in `services/api.js`

## 📚 Categories

Pre-configured categories:

- Food 🍔
- Travel ✈️
- Rent 🏠
- Shopping 🛍️
- Entertainment 🎬
- Health 💊
- Utilities 💡
- Subscriptions 📱

## 🌐 Future Enhancements

- Backend API integration
- User authentication
- Multi-user support
- Export to CSV/PDF
- Dark mode toggle
- Goals and targets
- Savings tracker
- Investment tracking
- Mobile app (React Native)

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💼 Author

Built with ❤️ as a production-ready finance tracking solution.

---

**For questions or contributions, feel free to raise issues or submit pull requests!**
