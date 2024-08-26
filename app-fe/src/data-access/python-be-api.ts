import redis from "@/db/redis";

const BASE_URL = process.env.PYTHON_BE_BASE_URL || "http://localhost:8000";

async function fetchWithCache(
  url: string,
  cacheKey: string,
  expiration: number = 900,
) {
  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await response.json();
  await redis.set(cacheKey, data, { ex: expiration });
  return data;
}

export async function analyzeIndustry(industry: string) {
  const url = `${BASE_URL}/analyze-industry/${industry}`;
  return fetchWithCache(url, `fe_analyze_industry_${industry}`, 3600); // Cache for 1 hour
}

export async function rankCompanies(industry: string) {
  const url = `${BASE_URL}/rank-companies/${industry}`;
  return fetchWithCache(url, `fe_rank_companies_${industry}`, 3600); // Cache for 1 hour
}

export async function analyzeStock(ticker: string) {
  const url = `${BASE_URL}/analyze-stock/${ticker}`;
  return fetchWithCache(url, `fe_analyze_stock_${ticker}`, 1800); // Cache for 30 minutes
}

export async function getStockData(ticker: string, years: number = 1) {
  const url = `${BASE_URL}/stock-data/${ticker}?years=${years}`;
  return fetchWithCache(url, `fe_stock_data_${ticker}_${years}`, 3600); // Cache for 1 hour
}

export async function generateTickerIdeas(industry: string) {
  const url = `${BASE_URL}/generate-ticker-ideas/${industry}`;
  return fetchWithCache(url, `fe_ticker_ideas_${industry}`, 86400); // Cache for 24 hours
}

export async function getSentimentAnalysis(ticker: string) {
  const url = `${BASE_URL}/sentiment-analysis/${ticker}`;
  return fetchWithCache(url, `fe_sentiment_analysis_${ticker}`, 7200); // Cache for 2 hours
}

export async function getAnalystRatings(ticker: string) {
  const url = `${BASE_URL}/analyst-ratings/${ticker}`;
  return fetchWithCache(url, `fe_analyst_ratings_${ticker}`, 3600); // Cache for 1 hour
}

export async function getIndustryAnalysis(ticker: string) {
  const url = `${BASE_URL}/industry-analysis/${ticker}`;
  return fetchWithCache(url, `fe_industry_analysis_${ticker}`, 86400); // Cache for 24 hours
}

export async function getFinalAnalysis(ticker: string) {
  const url = `${BASE_URL}/final-analysis/${ticker}`;
  return fetchWithCache(url, `fe_final_analysis_${ticker}`, 3600); // Cache for 1 hour
}

export async function getCurrentPrice(ticker: string) {
  const url = `${BASE_URL}/current-price/${ticker}`;
  return fetchWithCache(url, `fe_current_price_${ticker}`, 60); // Cache for 1 minute
}

export async function getTop50SP500Stocks() {
  const url = `${BASE_URL}/top-50-sp500-stocks`;
  return fetchWithCache(url, "fe_top_50_sp500_stocks", 900); // Cache for 15 minutes
}

export async function getAllStockData(ticker: string) {
  const [
    stockAnalysis,
    stockData,
    sentimentAnalysis,
    analystRatings,
    industryAnalysis,
    finalAnalysis,
    currentPrice,
  ] = await Promise.all([
    analyzeStock(ticker),
    getStockData(ticker),
    getSentimentAnalysis(ticker),
    getAnalystRatings(ticker),
    getIndustryAnalysis(ticker),
    getFinalAnalysis(ticker),
    getCurrentPrice(ticker),
  ]);

  return {
    stockAnalysis,
    stockData,
    sentimentAnalysis,
    analystRatings,
    industryAnalysis,
    finalAnalysis,
    currentPrice,
  };
}
