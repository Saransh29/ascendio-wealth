import ReactMarkdown from "react-markdown";

interface StockAnalysisProps {
  analysis: {
    error: boolean;
    message: string;
    data: {
      sentiment_analysis: string;
      analyst_ratings: string;
      industry_analysis: string;
      final_analysis: string;
      price: string;
    };
  };
}

export default function StockAnalysis({ analysis }: StockAnalysisProps) {
  const { data } = analysis;
  const currentPrice = JSON.parse(data?.price)?.data || data?.price || "-";

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Current Price</h2>
          <p className="text-4xl font-bold text-green-400">
            ${Number(currentPrice).toFixed(2)} USD
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Sentiment Analysis</h2>
        <p className="text-gray-300">{data?.sentiment_analysis || "-"}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Analyst Ratings</h2>
        <p className="text-gray-300">{data?.analyst_ratings || "-"}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Industry Analysis</h2>
        <p className="text-gray-300">{data?.industry_analysis || "-"}</p>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Final Analysis</h2>
        <div className="text-gray-300 whitespace-pre-wrap bg-gray-900 p-4 rounded-lg">
          <ReactMarkdown>{data?.final_analysis}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
