import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Search,
  ShieldCheck,
  Sparkles,
  Users
} from "lucide-react";
import SearchAndResults from "../components/SearchAndResults";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

// Value propositions
const features = [
  {
    icon: ShieldCheck,
    title: "Verified Hostels",
    description: "Every listing is verified for safety, amenities, and accurate pricing."
  },
  {
    icon: Sparkles,
    title: "Easy Comparison",
    description: "Compare prices, distances, and room types all in one place."
  },
  {
    icon: Users,
    title: "Student-Focused",
    description: "Built specifically for Ghanaian university students and their needs."
  }
];

// Quick stats
const stats = [
  { value: "120+", label: "Verified Hostels" },
  { value: "24h", label: "Average Response" },
  { value: "0.5-3km", label: "Campus Distance" }
];

// How it works steps
const steps = [
  {
    step: "1",
    title: "Search",
    description: "Filter by location, budget, and room type to find your perfect match."
  },
  {
    step: "2",
    title: "Compare",
    description: "Review prices, amenities, photos, and distance from campus."
  },
  {
    step: "3",
    title: "Book",
    description: "Secure your accommodation with confidence in just a few clicks."
  }
];

// Contact methods
const contactMethods = [
  { icon: Mail, value: "support@gnahostels.com", label: "Email Support" },
  { icon: Phone, value: "+233 000 000 000", label: "Call Us" },
  { icon: MapPin, value: "Ghana-wide coverage", label: "Nationwide" }
];

export default function HomePage(): JSX.Element {
  return (
    <div className="space-y-16 pb-8">
      {/* Hero Section */}
      <section className="relative">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          {/* Hero Content */}
          <div className="space-y-6">
            <Badge variant="primary" className="animate-fade-up">
              <Building2 className="mr-1 h-3 w-3" />
              Verified Student Accommodation
            </Badge>

            <h1 className="font-display text-4xl font-bold leading-tight text-foreground animate-fade-up-delay-1 sm:text-5xl lg:text-6xl">
              Find your perfect hostel near campus
            </h1>

            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed animate-fade-up-delay-2">
              Search verified hostels, compare rooms and prices, and book with
              confidence. The modern way to find student accommodation in Ghana.
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-fade-up-delay-3">
              <Link href="#search">
                <Button variant="primary" size="lg">
                  Browse Hostels
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/discover">
                <Button variant="outline" size="lg">
                  <Search className="h-4 w-4" />
                  Quick Search
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 animate-fade-up-delay-3">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <p className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-up-delay-2">
            <div className="overflow-hidden rounded-2xl shadow-soft-xl">
              <div
                className="aspect-[4/3] bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent rounded-2xl" />

              {/* Floating Cards */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="rounded-lg bg-card/95 px-4 py-2 shadow-soft-md backdrop-blur-sm">
                  <p className="text-sm font-semibold text-foreground">Live Availability</p>
                  <p className="text-xs text-muted-foreground">Updated in real-time</p>
                </div>
                <div className="rounded-lg bg-primary px-4 py-2 shadow-soft-md">
                  <p className="text-sm font-semibold text-primary-foreground">GHS Pricing</p>
                  <p className="text-xs text-primary-foreground/80">Local currency</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-6 sm:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} variant="elevated" padding="lg">
              <CardContent className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Search Section */}
      <section id="search" className="scroll-mt-8 space-y-6">
        <div className="space-y-2">
          <Badge variant="secondary">Top Picks</Badge>
          <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
            Verified Student Hostels
          </h2>
          <p className="text-muted-foreground">
            Browse our curated selection of verified hostels near your campus.
          </p>
        </div>

        <SearchAndResults />
      </section>

      {/* How it Works Section */}
      <section className="rounded-2xl bg-foreground p-8 text-background sm:p-12">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="space-y-4">
            <Badge variant="outline" className="border-background/20 text-background/80">
              How It Works
            </Badge>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Search. Compare. Book.
            </h2>
            <p className="text-background/70 leading-relaxed">
              A simple booking journey with transparent pricing, verified
              listings, and room-level availability tracking.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-background/10 bg-background/5 p-5 backdrop-blur-sm"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="font-semibold text-background">{item.title}</h3>
                <p className="mt-2 text-sm text-background/60 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="space-y-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <Badge variant="default">Support</Badge>
            <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
              Need Help Finding a Hostel?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our team is here to help you find the perfect accommodation near
              your campus. Reach out for booking support, verification
              questions, or personalized recommendations.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {contactMethods.map(({ icon: Icon, value, label }) => (
              <Card key={label} padding="md">
                <CardContent className="space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="rounded-2xl bg-gradient-to-r from-primary to-secondary p-8 text-center sm:p-12">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="flex justify-center">
            <CheckCircle2 className="h-12 w-12 text-primary-foreground/80" />
          </div>
          <h2 className="font-display text-2xl font-bold text-primary-foreground sm:text-3xl">
            Ready to Find Your Perfect Hostel?
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Join thousands of students who have found their ideal accommodation
            through GNA Hostels.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-background text-foreground hover:bg-background/90"
              >
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/listings">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Browse All Hostels
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
