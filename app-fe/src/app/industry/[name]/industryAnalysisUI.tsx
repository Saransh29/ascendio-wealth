import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

interface AnalysisData {
  tickers: string[];
  analyses: Record<string, string>;
  ranking: string;
}

interface IndustryAnalysisUIProps {
  industryName: string;
  analysisData: AnalysisData | null;
  isLoading: boolean;
}

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </CardContent>
        </Card>

        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6 mb-2" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function IndustryAnalysisUI({
  industryName,
  analysisData,
  isLoading,
}: IndustryAnalysisUIProps) {
  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!analysisData) {
    return <p className="text-red-500">No analysis data available.</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent>
          <p>Analyzed tickers: {analysisData?.tickers?.join(", ")}</p>
        </CardContent>
      </Card>

      <div className="flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <ReactMarkdown>{analysisData.ranking}</ReactMarkdown>
          </CardContent>
        </Card>

        {analysisData.tickers.map((ticker) => (
          <Card key={ticker}>
            <CardHeader>
              <CardTitle>{ticker} Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown>{analysisData.analyses[ticker]}</ReactMarkdown>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
