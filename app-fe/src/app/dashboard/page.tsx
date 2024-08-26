import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getAllMarketData } from "@/data-access/finmodellingprep-api";
import DashboardUI from "./DashboardUI";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const marketData = await getAllMarketData();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
      <DashboardUI marketData={marketData} />
    </div>
  );
}