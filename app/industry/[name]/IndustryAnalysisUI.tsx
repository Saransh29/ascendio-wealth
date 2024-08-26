import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';

interface AnalysisData {
  tickers: string[];
  analyses: Record<string, string>;
  ranking: string;
}

interface IndustryAnalysisUIProps {
  industryName: string;
  analysisData: AnalysisData;
}

export function IndustryAnalysisUI({ industryName, analysisData }: IndustryAnalysisUIProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{industryName} Industry Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Analyzed tickers: {analysisData.tickers.join(', ')}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="ranking">
        <TabsList>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          {analysisData.tickers.map((ticker) => (
            <TabsTrigger key={ticker} value={ticker}>{ticker}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="ranking">
          <Card>
            <CardHeader>
              <CardTitle>Company Ranking</CardTitle>
            </CardHeader>
            <CardContent>
              <ReactMarkdown>{analysisData.ranking}</ReactMarkdown>
            </CardContent>
          </Card>
        </TabsContent>

        {analysisData.tickers.map((ticker) => (
          <TabsContent key={ticker} value={ticker}>
            <Card>
              <CardHeader>
                <CardTitle>{ticker} Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ReactMarkdown>{analysisData.analyses[ticker]}</ReactMarkdown>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default IndustryAnalysisUI;