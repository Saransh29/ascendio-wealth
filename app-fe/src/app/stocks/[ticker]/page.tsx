import { Suspense } from "react";
import { analyzeStock } from "@/data-access/python-be-api";
import StockAnalysis from "./components/StockAnalysis";
import Loading from "./loading";

export default function StockPage({ params }: { params: { ticker: string } }) {
  const { ticker } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{ticker} Stock Analysis</h1>
      <Suspense fallback={<Loading />}>
        <StockAnalysisWrapper ticker={ticker} />
      </Suspense>
    </div>
  );
}

async function StockAnalysisWrapper({ ticker }: { ticker: string }) {
  const stockAnalysis = await analyzeStock(ticker);
  return <StockAnalysis analysis={stockAnalysis} />;
}
