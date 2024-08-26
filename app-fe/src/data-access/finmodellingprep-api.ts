import redis from "@/db/redis";

const API_KEY = process.env.FIN_MODELLING_PREP_API_KEY!;
const BASE_URL = "https://financialmodelingprep.com/api/v3";

async function fetchWithCache(url: string, cacheKey: string) {
  const cachedData: any = await redis.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await response.json();
  await redis.set(cacheKey, data);
  return data;
}

export async function getMarketNews(page = 0, size = 5) {
  const url = `${BASE_URL}/fmp/articles?page=${page}&size=${size}&apikey=${API_KEY}`;
  return fetchWithCache(url, `market_news_${page}_${size}`);
}

export async function getMarketGainers() {
  const url = `${BASE_URL}/stock_market/gainers?apikey=${API_KEY}`;
  return fetchWithCache(url, "market_gainers");
}

export async function getMarketLosers() {
  const url = `${BASE_URL}/stock_market/losers?apikey=${API_KEY}`;
  return fetchWithCache(url, "market_losers");
}

export async function getMarketMostActive() {
  const url = `${BASE_URL}/stock_market/actives?apikey=${API_KEY}`;
  return fetchWithCache(url, "market_most_active");
}

export async function getSectorPerformance() {
  const today = new Date().toISOString().split("T")[0];
  const url = `${BASE_URL}/historical-sectors-performance?from=${today}&to=${today}&limit=1&apikey=${API_KEY}`;
  return fetchWithCache(url, "sector_performance");
}

export async function getAllMarketData() {
  const [news, gainers, losers, mostActive, sectorPerformance] =
    await Promise.all([
      getMarketNews(),
      getMarketGainers(),
      getMarketLosers(),
      getMarketMostActive(),
      getSectorPerformance(),
    ]);

  return {
    news,
    gainers,
    losers,
    mostActive,
    sectorPerformance,
  };
}
