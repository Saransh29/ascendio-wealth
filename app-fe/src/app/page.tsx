import { redirect } from "next/navigation";
import Link from "next/link";
import { siteConfig } from "../../config/site";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Spotlight } from "@/components/ui/spotlight";
import { Newspaper, TrendingUp, Brain, BarChart2, Building } from "lucide-react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();

  const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-blue-950 dark:to-neutral-950 to-neutral-100"></div>
  );

  const features = [
    {
      title: "News Sentiment Analysis",
      description: "Analyze market sentiment from latest news articles.",
      icon: <Newspaper className="w-6 h-6 text-blue-500" />,
      header: <Skeleton />,
    },
    {
      title: "Analyst Ratings",
      description: "Aggregate and interpret professional analyst recommendations.",
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      header: <Skeleton />,
    },
    {
      title: "AI-Powered Insights",
      description: "Get intelligent investment suggestions based on comprehensive analysis.",
      icon: <Brain className="w-6 h-6 text-purple-500" />,
      header: <Skeleton />,
    },
    {
      title: "Financial Analysis",
      description: "Deep dive into company financials and performance metrics.",
      icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
      header: <Skeleton />,
    },
    {
      title: "Industry Analysis",
      description: "Understand market trends and industry-specific factors.",
      icon: <Building className="w-6 h-6 text-pink-500" />,
      header: <Skeleton />,
    },
  ];

  return (
    <>
      <Spotlight />
      <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
        <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
          <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
            Ascend your wealth
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8 py-2">
            Make informed investment decisions with our comprehensive analysis platform.
            Leverage AI-powered insights from news, analyst ratings, financials, and industry trends.
          </p>
          <div className="space-x-4">
            <Link
              href={user ? "/dashboard" : "/sign-in"}
              className={cn(
                buttonVariants({ size: "lg" }),
                "border-r-4 text-sm font-bold",
              )}
            >
              Start Analyzing
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-center font-bold text-3xl lg:text-5xl py-8">
          Features
        </h2>

        <BentoGrid className="max-w-4xl mx-auto">
          {features.map((item, i) => (
            <BentoGridItem
              key={i}
              title={item.title}
              description={item.description}
              header={item.header}
              icon={item.icon}
              className={i === 3 || i === 6 ? "md:col-span-2" : ""}
            />
          ))}
        </BentoGrid>
      </section>

      <section id="open-source" className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center"></div>
      </section>
    </>
  );
}