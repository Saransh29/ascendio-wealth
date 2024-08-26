import { BarChart, ThumbsUp, DollarSign, Briefcase, Globe } from "lucide-react";

export default async function aboutPage() {
  const benefits = [
    {
      Icon: BarChart,
      text: "Gain insights from comprehensive financial analysis",
    },
    {
      Icon: ThumbsUp,
      text: "Make informed decisions with sentiment analysis based on news",
    },
    {
      Icon: DollarSign,
      text: "Track and evaluate analyst ratings effectively",
    },
    {
      Icon: Briefcase,
      text: "Understand industry trends and their impact on investments",
    },
    {
      Icon: Globe,
      text: "Stay updated with global market movements and forecasts",
    },
  ];

  return (
    <div className="p-6">
      <div className=" text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">
            Make Smarter Investment Decisions
          </h2>
          <p className="text-gray-400 mb-12 max-w-2xl">
            Our tool provides you with the latest insights from financial news,
            analyst ratings, and industry trends, helping you make well-informed
            investment decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map(({ Icon, text }, index) => (
              <div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-row items-center justify-center gap-2"
              >
                <Icon className="w-8 h-8 mr-4 text-blue-400 flex-shrink-0" />
                <p className="text-base">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col gap-6 ">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose Our Tool?</h2>
            <p className="text-gray-300 mb-4">
              Traditional investment tools can be overwhelming and fragmented.
              Our integrated solution provides a seamless experience, linking
              various data points to give you a clear picture of the market.
            </p>
            <p className="text-gray-300">
              With our tool, you can regain control over your investments, make
              informed decisions, and achieve your financial goals.
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
            <p className="text-gray-300 mb-4">
              In today&apos;s fast-paced world, staying updated with the latest
              market trends and news is crucial. Our tool helps you cut through
              the noise and focus on what truly matters.
            </p>
            <p className="text-gray-300 mb-4">
              We believe in empowering investors with the right information at
              the right time, so you can make decisions with confidence and
              clarity.
            </p>
          </div>
          <div>
            <p className="text-xl font-bold mb-6">Invest with Confidence.</p>
            <p className="text-gray-300 mb-4">
              Our tool bridges the gap between your investment goals and the
              daily market movements. Stay informed, stay ahead, and achieve
              your financial dreams.
            </p>
            <p className="text-gray-300 font-semibold">
              Your investment journey starts here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
