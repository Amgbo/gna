import { Filter, MapPin, ShieldCheck } from "lucide-react";
import SearchAndResults from "../../components/SearchAndResults";
import { Badge } from "../../components/ui/Badge";
import { Card, CardContent } from "../../components/ui/Card";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Only",
    description: "Focus on trusted, verified listings"
  },
  {
    icon: Filter,
    title: "Smart Filters",
    description: "Find the right room faster"
  },
  {
    icon: MapPin,
    title: "Campus Aware",
    description: "Sort by distance to campus"
  }
];

export default function ListingsPage(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-2xl bg-foreground p-6 text-background sm:p-8 lg:p-10">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="border-background/20 text-background/80">
              All Listings
            </Badge>
            <h1 className="font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Compare verified hostels in one place
            </h1>
            <p className="max-w-lg text-background/70 leading-relaxed">
              Use filters to narrow by price, distance, room type, and verification status.
              Built for fast comparisons and confident booking.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-background/10 bg-background/5 p-4 backdrop-blur-sm"
                >
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-background/10">
                    <Icon className="h-5 w-5 text-background" />
                  </div>
                  <h3 className="font-semibold text-background">{feature.title}</h3>
                  <p className="mt-1 text-sm text-background/60">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and Results */}
      <SearchAndResults />
    </div>
  );
}
