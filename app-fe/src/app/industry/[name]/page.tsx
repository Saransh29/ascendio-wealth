import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { analyzeIndustry } from "@/data-access/python-be-api";
import IndustryAnalysisUI from "./IndustryAnalysisUI";
import { Suspense } from "react";

export default async function IndustryAnalysisPage({
  params,
}: {
  params: { name: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const industryName = decodeURIComponent(params.name);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">
        {industryName} Industry Analysis
      </h1>
      <Suspense
        fallback={
          <IndustryAnalysisUI
            industryName={industryName}
            analysisData={null}
            isLoading={true}
          />
        }
      >
        <IndustryAnalysisContent industryName={industryName} />
      </Suspense>
    </div>
  );
}

async function IndustryAnalysisContent({
  industryName,
}: {
  industryName: string;
}) {
  try {
    const analysisData = await analyzeIndustry(industryName);

    return (
      <IndustryAnalysisUI
        industryName={industryName}
        analysisData={analysisData?.data}
        isLoading={false}
      />
    );
  } catch (error) {
    console.error("Error fetching industry data:", error);
    return (
      <IndustryAnalysisUI
        industryName={industryName}
        analysisData={null}
        isLoading={false}
      />
    );
  }
}
