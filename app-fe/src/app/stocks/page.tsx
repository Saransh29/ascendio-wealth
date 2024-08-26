import { getTop50SP500Stocks } from "@/data-access/python-be-api";
import StockList from "./components/StockList";

export default async function StocksPage() {
  const stocksData = await getTop50SP500Stocks();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Top 50 S&P 500 Stocks</h1>
      <StockList stocks={stocksData} />
    </div>
  );
}
