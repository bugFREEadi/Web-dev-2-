import axios from "axios";

const API_BASE_URL = "https://api.exchangerate-api.com/v4/latest/INR";
const NEWS_API_BASE_URL = "https://newsapi.org/v2/everything";
const NEWS_API_KEY = "your_newsapi_key_here";

const apiClient = axios.create({
  timeout: 10000,
});

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export const currencyService = {
  getExchangeRates: async () => {
    try {
      const response = await apiClient.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error);
      throw error;
    }
  },

  convertCurrency: async (amount, targetCurrency = "USD") => {
    try {
      const response = await apiClient.get(API_BASE_URL);
      const rate = response.data.rates[targetCurrency];
      return (amount * rate).toFixed(2);
    } catch (error) {
      console.error("Failed to convert currency:", error);
      throw error;
    }
  },
};

export const newsService = {
  getFinancialNews: async () => {
    try {
      const response = await apiClient.get(NEWS_API_BASE_URL, {
        params: {
          q: "personal finance OR investment OR savings",
          sortBy: "publishedAt",
          apiKey: NEWS_API_KEY,
          pageSize: 10,
          language: "en",
        },
      });
      return response.data.articles;
    } catch (error) {
      console.error("Failed to fetch news:", error);
      return [];
    }
  },
};

export default apiClient;
