# 🚀 Finance Tracker - Quick Start Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional, for version control)

## Step-by-Step Setup

### 1. Clone/Download the Project

```bash
# If using git
git clone <repository-url>
cd finance-tracker

# Or simply navigate to the folder if already downloaded
cd finance-tracker
```

### 2. Install Dependencies

```bash
npm install
# or with yarn
yarn install
```

This will install all required packages including:

- React and React Router
- Tailwind CSS
- Recharts for data visualization
- React Hook Form with Yup validation
- Framer Motion for animations
- And more...

### 3. Create Environment File (Optional)

If you want to use API features:

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your API keys
```

### 4. Start Development Server

```bash
npm run dev
# or with yarn
yarn dev
```

The app should open automatically at `http://localhost:5173`

### 5. Start Using the App

#### 🏠 First Steps

1. Go to **Dashboard** to see your overview
2. Click **+ Add Transaction** to create your first transaction
3. Set your monthly **Budget** (default: ₹50,000)
4. View your analytics on the **Analytics** page

#### 📝 Adding Transactions

- Title: Give a descriptive name
- Amount: Enter the transaction amount
- Category: Choose from 8 categories
- Type: Income or Expense
- Date: Select the transaction date
- Notes: Add optional details
- Recurring: Mark if it repeats monthly

#### 💰 Managing Budget

- Set your monthly budget limit
- View spending by category
- Track percentage used
- Get warnings when approaching/exceeding budget

#### 📊 Viewing Analytics

- See 12-month trends
- Category spending breakdown
- Income vs Expense comparison
- Recurring transaction tracking
- Average spending insights

## Project Structure

```
finance-tracker/
├── src/
│   ├── components/          # Reusable React components
│   ├── pages/               # Page components (Dashboard, Transactions, etc.)
│   ├── context/             # Global state management (FinanceContext)
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API calls (axios)
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main app component with routing
│   ├── main.jsx             # React entry point
│   ├── constants.js         # App-wide constants
│   └── index.css            # Global styles
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── index.html               # HTML template
└── README.md                # Full documentation
```

## Available Scripts

### Development

```bash
npm run dev      # Start development server (auto-reload)
```

### Production

```bash
npm run build    # Build for production
npm run preview  # Preview production build locally
```

### Linting

```bash
npm run lint     # Run ESLint to check code quality
```

## Features Overview

### ✅ Transaction Management

- Add new transactions with validation
- Edit existing transactions
- Delete transactions
- Search by title/notes
- Filter by category, type, date range
- Sort by date/amount

### ✅ Budget Tracking

- Set monthly budget limit
- Visual progress bar
- Category-wise spending breakdown
- Budget exceeded alerts
- Percentage usage display

### ✅ Analytics & Insights

- 12-month trend analysis
- Category distribution charts
- Income vs expense comparison
- Recurring transaction tracking
- Monthly averages
- Top category identification

### ✅ User Experience

- Smooth animations
- Toast notifications
- Loading states
- Empty states
- Error handling
- Fully responsive design
- Clean modern UI

## Data Persistence

All your data is automatically saved to **localStorage** in your browser:

- Transactions are persisted locally
- Budget settings are saved
- No backend server required
- Data stays private on your device

To clear data:

```javascript
// In browser console
localStorage.clear();
```

## Common Issues & Solutions

### Issue: npm install fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### Issue: Port 5173 already in use

**Solution:**

```bash
# Vite will automatically try the next available port
# Or specify a different port in vite.config.js
```

### Issue: Styling not working

**Solution:**

```bash
# Rebuild Tailwind CSS
npm run dev  # This should auto-rebuild

# Or manually rebuild
npx tailwindcss -i src/index.css -o src/output.css
```

### Issue: Charts not displaying

**Solution:**

- Ensure Recharts is installed: `npm install recharts`
- Check that transaction data exists
- Verify component imports are correct

## Tips & Best Practices

### 🎯 For Best Performance

1. Clear browser cache periodically
2. Use the search and filters efficiently
3. Avoid creating too many transactions at once
4. Back up your data (export feature coming soon)

### 💡 For Better Budget Management

1. Set a realistic monthly budget
2. Review transactions weekly
3. Use categories consistently
4. Mark recurring expenses
5. Monitor the analytics regularly

### 🔐 For Data Safety

1. Your data is stored locally in your browser
2. Clear cookies/cache might delete your data
3. Use your browser's backup/sync features
4. Export data occasionally (feature coming)

## Browser Compatibility

Works on:

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## Next Steps

1. **Explore Features**: Try all pages and features
2. **Add Sample Data**: Create test transactions
3. **Customize Budget**: Set your real budget limit
4. **Analyze Patterns**: Check analytics for insights
5. **Configure API**: (Optional) Set up currency exchange integration

## Optional: API Integration

### Exchange Rate API

```javascript
// Get your free key from: https://www.exchangerate-api.com
// Add to .env.local:
VITE_EXCHANGE_RATE_API_KEY = your_key_here;

// Usage:
import { currencyService } from "./services/api";
const converted = await currencyService.convertCurrency(1000, "USD");
```

### News API

```javascript
// Get your free key from: https://newsapi.org
// Add to .env.local:
VITE_NEWS_API_KEY = your_key_here;

// Usage:
import { newsService } from "./services/api";
const news = await newsService.getFinancialNews();
```

## Troubleshooting

### Reset Everything

```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Start fresh
npm run dev
```

### Check Node Version

```bash
node --version  # Should be v16+
npm --version   # Should be v7+
```

## Support & Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org
- **Framer Motion**: https://www.framer.com/motion
- **Vite**: https://vitejs.dev

## Next Features (Roadmap)

- 🔒 User authentication
- ☁️ Cloud backup
- 📱 Mobile app
- 📊 Advanced reports
- 🎯 Savings goals
- 💾 Data export (CSV/PDF)
- 🌙 Dark mode
- 🌐 Multi-currency support

---

**Happy tracking! 💰**

For issues or questions, refer to the main README.md or create an issue on the repository.
