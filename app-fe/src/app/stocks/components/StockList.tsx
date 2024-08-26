import Link from "next/link";

interface Stock {
  Symbol: string;
  Name: string;
  "Market Cap": string;
  Price: string;
  Change: string;
  Volume: string;
}

interface StockListProps {
  stocks: Stock[];
}

export default function StockList({ stocks }: StockListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full ">
        <thead className="bg-gray-700">
          <tr>
            <th className="px-4 py-2 text-left">Symbol</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-right">Market Cap</th>
            <th className="px-4 py-2 text-right">Price</th>
            <th className="px-4 py-2 text-right">Change</th>
            <th className="px-4 py-2 text-right">Volume</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.Symbol} className="hover:bg-gray-700">
              <td className="px-4 py-2">
                <Link
                  href={`/stocks/${stock.Symbol}`}
                  className="text-blue-600 hover:underline"
                >
                  {stock.Symbol}
                </Link>
              </td>
              <td className="px-4 py-2">{stock.Name}</td>
              <td className="px-4 py-2 text-right">{stock["Market Cap"]}</td>
              <td className="px-4 py-2 text-right">{stock.Price}</td>
              <td className="px-4 py-2 text-right">{stock.Change}</td>
              <td className="px-4 py-2 text-right">{stock.Volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
