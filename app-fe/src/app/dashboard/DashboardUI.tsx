"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MarketData {
  news: any;
  gainers: any[];
  losers: any[];
  mostActive: any[];
  sectorPerformance: any[];
}

interface DashboardUIProps {
  marketData: MarketData;
}

export default function DashboardUI({ marketData }: DashboardUIProps) {
  const { news, gainers, losers, mostActive, sectorPerformance } = marketData;

  const mostActiveStock = mostActive[0];
  const topGainer = gainers[0];
  const topLoser = losers[0];

  const getColorClass = (change: number) =>
    change >= 0 ? "text-green-500" : "text-red-500";

  const getTopSector = () => {
    if (!sectorPerformance || sectorPerformance.length === 0) return null;

    const latestPerformance = sectorPerformance[0];
    const sectors = [
      {
        name: "Basic Materials",
        value: latestPerformance.basicMaterialsChangesPercentage,
      },
      {
        name: "Communication Services",
        value: latestPerformance.communicationServicesChangesPercentage,
      },
      {
        name: "Consumer Cyclical",
        value: latestPerformance.consumerCyclicalChangesPercentage,
      },
      {
        name: "Consumer Defensive",
        value: latestPerformance.consumerDefensiveChangesPercentage,
      },
      { name: "Energy", value: latestPerformance.energyChangesPercentage },
      {
        name: "Financial Services",
        value: latestPerformance.financialServicesChangesPercentage,
      },
      {
        name: "Healthcare",
        value: latestPerformance.healthcareChangesPercentage,
      },
      {
        name: "Industrials",
        value: latestPerformance.industrialsChangesPercentage,
      },
      {
        name: "Real Estate",
        value: latestPerformance.realEstateChangesPercentage,
      },
      {
        name: "Technology",
        value: latestPerformance.technologyChangesPercentage,
      },
      {
        name: "Utilities",
        value: latestPerformance.utilitiesChangesPercentage,
      },
    ];

    return sectors.reduce((max, sector) =>
      max.value > sector.value ? max : sector,
    );
  };

  const topSector = getTopSector();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Gainer</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topGainer.symbol}</div>
          <p
            className={`text-xs ${getColorClass(topGainer.changesPercentage)}`}
          >
            +{topGainer.changesPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Loser</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <rect width="20" height="14" x="2" y="5" rx="2" />
            <path d="M2 10h20" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topLoser.symbol}</div>
          <p className={`text-xs ${getColorClass(topLoser.changesPercentage)}`}>
            {topLoser.changesPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Most Active</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mostActiveStock.symbol}</div>
          <p
            className={`text-xs ${getColorClass(
              mostActiveStock.changesPercentage,
            )}`}
          >
            {mostActiveStock.changesPercentage.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Top Sector</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{topSector?.name}</div>
          <p className={`text-xs ${getColorClass(topSector?.value || 0)}`}>
            {topSector?.value.toFixed(2)}%
          </p>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Recent News</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {news?.content && Array.isArray(news?.content) ? (
                <>
                  {news?.content.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item?.title}
                      </TableCell>
                      <TableCell>
                        {new Date(item?.date).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card
        className="col-span-2 duration-300 hover:bg-opacity-80 hover:bg-muted transition-colors cursor-pointer min-h-36"
        onClick={() => (window.location.href = "/industry")}
      >
        <CardHeader>
          <CardTitle>Analyze Industry</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Explore industry trends, market dynamics, and sector performance to
            inform your investment strategy.
          </p>
        </CardContent>
      </Card>
      <Card
        className="col-span-2 duration-300 hover:bg-opacity-80 hover:bg-muted transition-colors cursor-pointer min-h-36"
        onClick={() => (window.location.href = "/stocks")}
      >
        <CardHeader>
          <CardTitle>Analyze Stocks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Get in-depth analysis of individual stocks based on news sentiment,
            historical data, and analyst ratings.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
