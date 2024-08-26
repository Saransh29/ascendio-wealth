import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  Activity,
  Heart,
  DollarSign,
  Zap,
  ShoppingCart,
  Coffee,
  Briefcase,
  Building2,
  Home,
  Power,
  Phone,
  Car,
  Plane,
  TestTube,
  Film,
  ShoppingBag,
  Truck,
  Leaf,
  GraduationCap,
  Shield,
  Brain,
  Cpu,
  Recycle,
  ShoppingBasket,
  Utensils,
} from "lucide-react";
import Link from "next/link";
export default function Component() {
  const industries = [
    {
      name: "Technology",
      description: "Software, hardware, and internet-based services",
      icon: Activity,
    },
    {
      name: "Healthcare",
      description: "Medical devices, pharmaceuticals, and healthcare services",
      icon: Heart,
    },
    {
      name: "Financial Services",
      description: "Banks, insurance, and investment management firms",
      icon: DollarSign,
    },
    {
      name: "Energy",
      description: "Oil, gas, renewable energy production companies",
      icon: Zap,
    },
    {
      name: "Consumer Discretionary",
      description: "Non-essential goods and services for consumers",
      icon: ShoppingCart,
    },
    {
      name: "Consumer Staples",
      description: "Essential products used in daily life",
      icon: Coffee,
    },
    {
      name: "Industrials",
      description: "Manufacturing, aerospace, and defense industries",
      icon: Briefcase,
    },
    {
      name: "Materials",
      description: "Chemicals, mining, and construction materials companies",
      icon: Building2,
    },
    {
      name: "Real Estate",
      description: "Property management and development firms",
      icon: Home,
    },
    {
      name: "Utilities",
      description: "Electric, gas, and water service providers",
      icon: Power,
    },
    {
      name: "Telecommunications",
      description: "Wireless and broadband communication service companies",
      icon: Phone,
    },
    {
      name: "Automotive",
      description: "Car manufacturers and auto parts suppliers",
      icon: Car,
    },
    {
      name: "Aerospace",
      description: "Aircraft and spacecraft manufacturing companies",
      icon: Plane,
    },
    {
      name: "Biotechnology",
      description: "Companies developing new drugs and therapies",
      icon: TestTube,
    },
    {
      name: "Media and Entertainment",
      description: "Film, television, and streaming content producers",
      icon: Film,
    },
    {
      name: "Retail",
      description: "Brick-and-mortar and e-commerce retail businesses",
      icon: ShoppingBag,
    },
    {
      name: "Transportation",
      description: "Airlines, shipping, and logistics companies",
      icon: Truck,
    },
    {
      name: "Agriculture",
      description: "Farming, food production, and distribution businesses",
      icon: Leaf,
    },
    {
      name: "Education",
      description: "For-profit schools and educational technology companies",
      icon: GraduationCap,
    },
    {
      name: "Cybersecurity",
      description: "Digital security and data protection firms",
      icon: Shield,
    },
    {
      name: "Artificial Intelligence",
      description: "Companies developing and applying AI technologies",
      icon: Brain,
    },
    {
      name: "Semiconductor",
      description: "Designers and manufacturers of computer chips",
      icon: Cpu,
    },
    {
      name: "Green Technology",
      description: "Environmentally friendly and sustainable tech companies",
      icon: Recycle,
    },
    {
      name: "E-commerce",
      description: "Online retail and digital marketplace businesses",
      icon: ShoppingBasket,
    },
    {
      name: "Hospitality",
      description: "Hotels, resorts, and travel-related services",
      icon: Utensils,
    },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="w-full py-12 md:py-24 lg:py-32 ">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Unlock insights into any industry with our powerful analytics.
          </h1>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4 md:px-6">
          {industries.map((industry, index) => (
            <Link
              key={index}
              href={`/industry/${encodeURIComponent(industry.name)}`}
              className="bg-background rounded-lg shadow-lg p-6 flex flex-col gap-4 hover:bg-muted transition-colors cursor-pointer"
            >
              <industry.icon className="w-8 h-8 text-primary" />
              <h3 className="text-xl font-semibold">{industry.name}</h3>
              <p className="text-muted-foreground">{industry.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
