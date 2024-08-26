const API_KEY = process.env.ALPHA_VANTAGE_API_KEY!;
const BASE_URL = "https://www.alphavantage.co/query";

const cache = new Map();

export async function getTopGainersLosers() {
  const cacheKey = "topGainersLosers";
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const response = await fetch(`${BASE_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to fetch top gainers and losers");
  }
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}

export async function getNewsSentiment(limit = 5) {
  const cacheKey = `newsSentiment-${limit}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  const response = await fetch(`${BASE_URL}?function=NEWS_SENTIMENT&limit=${limit}&apikey=${API_KEY}`);
  if (!response.ok) {
    throw new Error("Failed to fetch news sentiment");
  }
  const data = await response.json();
  cache.set(cacheKey, data);
  return data;
}
