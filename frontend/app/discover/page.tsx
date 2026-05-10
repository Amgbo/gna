import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Sparkles, Users } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

const features = [
  {
    icon: ShieldCheck,
    title: "Trust Signals",
    description: "Verified listings, cleaner hostel pages, and stronger booking confidence."
  },
  {
    icon: Sparkles,
    title: "Simpler Comparison",
    description: "Room type, price, and distance are easy to scan without digging through clutter."
  },
  {
    icon: Users,
    title: "Built for Students",
    description: "Designed around the practical decisions students make before a semester starts."
  },
  {
    icon: BookOpen,
    title: "Better Booking Flow",
    description: "A faster path from shortlist to reservation with less friction along the way."
  }
];

const tips = [
  "Check whether the hostel is verified",
  "Compare the first available price across rooms",
  "Use campus distance as a quick shortlist signal"
];

export default function DiscoverPage(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="space-y-4">
        <Badge variant="secondary">Discover</Badge>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
          Why this marketplace feels different
        </h1>
        <p className="max-w-3xl text-muted-foreground leading-relaxed">
          The experience is designed to feel calmer than a typical hostel directory.
          The goal is not just to show properties, but to help students quickly
          understand which ones are actually worth considering.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid gap-4 sm:grid-cols-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} variant="elevated" padding="lg">
              <CardContent className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground">
                  {feature.title}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-foreground p-6 text-background sm:p-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Badge variant="outline" className="border-background/20 text-background/80">
              Next Step
            </Badge>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Start comparing hostels
            </h2>
            <p className="max-w-md text-background/70 leading-relaxed">
              Once you know what matters most, jump to the listings page and filter
              by budget, distance, and room type.
            </p>
            <Link href="/listings">
              <Button
                variant="primary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Browse Listings
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="rounded-xl border border-background/10 bg-background/5 p-6 backdrop-blur-sm">
            <p className="font-semibold text-background mb-4">Helpful Tips</p>
            <ul className="space-y-3">
              {tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-3 text-sm text-background/70"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
