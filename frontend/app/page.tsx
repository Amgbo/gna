import SearchAndResults from "../components/SearchAndResults";
import { ArrowRight, Mail, MapPinned, PhoneCall, ShieldCheck, Sparkles, Star, Users } from "lucide-react";

// Three value propositions shown as benefit cards
const featuredBenefits = [
  {
    title: "Verified stays",
    description: "Handpicked hostels with better trust signals and cleaner presentation.",
    icon: ShieldCheck
  },
  {
    title: "Easy comparison",
    description: "See price, distance, and room availability in a single view.",
    icon: Sparkles
  },
  {
    title: "Student focused",
    description: "Built around the practical needs of students and landlords.",
    icon: Users
  }
];

// Trust-building stats shown in hero
const quickStats = [
  { label: "Verified hostels", value: "120+" },
  { label: "Average response", value: "24h" },
  { label: "Campus proximity", value: "0.5-3km" }
];

// Quick search filter suggestions
const searchChips = ["Near campus", "Lowest price", "Verified only", "Single rooms"];

export default function HomePage(): JSX.Element {
  const contactMethods: Array<{
    icon: typeof Mail;
    value: string;
    label: string;
  }> = [
    { icon: Mail, value: "support@gnahostels.com", label: "Email support" },
    { icon: PhoneCall, value: "+233 000 000 000", label: "Call the team" },
    { icon: MapPinned, value: "Campus service", label: "Ghana-wide coverage" }
  ];

  return (
    <section className="space-y-16 pb-8">
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-900 shadow-sm animate-fade-up">
            <Star className="h-4 w-4 text-amber-500" />
            Verified stays close to campus
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl animate-fade-up-delay-1">
              Find a hostel that feels calm, credible, and close.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600 animate-fade-up-delay-2">
              Search verified hostels, compare rooms and bed spaces, and book with confidence through a modern student-first marketplace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 animate-fade-up-delay-2">
            <a
              href="#featured"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5"
            >
              Explore hostels
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#discover"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              Search now
            </a>
          </div>

          <div className="hidden gap-3 sm:grid sm:grid-cols-3 lg:gap-4 animate-fade-up-delay-3">
            {quickStats.map((stat) => (
              <div key={stat.label} className="soft-card rounded-2xl p-4">
                <p className="text-xl font-semibold text-slate-950 sm:text-2xl">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-10 top-12 h-28 w-28 rounded-full bg-brand-500/20 blur-3xl animate-float" />
          <div className="absolute -right-10 bottom-8 h-32 w-32 rounded-full bg-amber-500/20 blur-3xl animate-float" />
          <div className="hero-grid overflow-hidden rounded-[36px] border border-white/80 shadow-[0_40px_100px_rgba(15,23,42,0.25)]">
            <div className="relative min-h-[580px] bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center p-6 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/25 to-slate-950/75" />
              <div className="relative flex h-full min-h-[540px] flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    Live availability
                  </div>
                  <div className="rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                    GHS pricing
                  </div>
                </div>

                <div className="max-w-xl space-y-4 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">Featured search</p>
                  <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
                    A polished marketplace for student housing.
                  </h2>
                  <p className="max-w-lg text-base leading-7 text-white/75">
                    Designed for quick comparison, confident booking, and a calmer path from search to move-in.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {featuredBenefits.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div key={item.title} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-white backdrop-blur-sm">
                        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="text-base font-semibold">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/70">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section id="discover" className="glass-panel space-y-5 rounded-[32px] p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">Filter & search</p>
            <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Find hostels near your campus</h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
            <MapPinned className="h-4 w-4 text-brand-500" />
            Campus-aware search and verified listings
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {searchChips.map((chip) => (
            <div key={chip} className="soft-card rounded-2xl px-4 py-3 text-sm font-medium text-slate-700">
              {chip}
            </div>
          ))}
        </div>
      </section>

      <section id="featured" className="space-y-6">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">Top picks</p>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Verified student hostels</h2>
        </div>

        <SearchAndResults />
      </section>

      <section className="grid gap-6 rounded-[32px] bg-slate-950 p-6 text-white shadow-[0_24px_60px_rgba(15,23,42,0.2)] sm:gap-8 sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-sm">How it works</p>
          <h2 className="text-2xl font-bold sm:text-3xl">Search. Compare. Book.</h2>
          <p className="max-w-md text-sm leading-6 text-white/70">
            A simple booking journey with clearer pricing, stronger trust signals, and room-to-bed level inventory.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {[
            ["Search", "Filter by location, budget, and room type"],
            ["Compare", "Review prices, amenities, and availability"],
            ["Book", "Secure your stay in a few clicks"]
          ].map(([title, description]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm sm:p-5">
              <p className="text-base font-semibold sm:text-lg">{title}</p>
              <p className="mt-1.5 text-xs leading-5 text-white/65 sm:mt-2 sm:text-sm">{description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="grid gap-6 rounded-[32px] border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] lg:grid-cols-[0.96fr_1.04fr] lg:items-center lg:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 sm:text-sm">Contact</p>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Need help choosing a hostel?</h2>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            Reach out for booking support, verification questions, or help finding a place near your campus. The team is set up to help students and landlords move faster.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {contactMethods.map(({ icon: IconComponent, value, label }) => {
            return (
              <div key={label} className="soft-card rounded-2xl p-4">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white">
                  <IconComponent className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-slate-950">{value}</p>
                <p className="mt-1 text-xs text-slate-500">{label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </section>
  );
}
