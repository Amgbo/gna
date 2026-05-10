import { BookOpen, ShieldCheck, Sparkles, Users } from "lucide-react";

const discoverPoints = [
  {
    icon: ShieldCheck,
    title: "Trust signals",
    description: "Verified listings, cleaner hostel pages, and stronger booking confidence."
  },
  {
    icon: Sparkles,
    title: "Simpler comparison",
    description: "Room type, price, and distance are easy to scan without digging through clutter."
  },
  {
    icon: Users,
    title: "Built for students",
    description: "Designed around the practical decisions students make before a semester starts."
  },
  {
    icon: BookOpen,
    title: "Better booking flow",
    description: "A faster path from shortlist to reservation with less friction along the way."
  }
];

export default function DiscoverPage(): JSX.Element {
  return (
    <section className="space-y-8 pb-8">
      <section className="rounded-[36px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Discover</p>
        <h1 className="mt-2 text-4xl font-bold text-slate-950 sm:text-5xl">Why this marketplace feels different.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          The experience is designed to feel calmer than a typical hostel directory. The goal is not just to show properties, but to help students quickly understand which ones are actually worth considering.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {discoverPoints.map((point) => {
          const Icon = point.icon;

          return (
            <article key={point.title} className="soft-card rounded-[28px] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-slate-950">{point.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{point.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 rounded-[32px] bg-slate-950 p-6 text-white lg:grid-cols-[1fr_1fr] lg:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Next step</p>
          <h2 className="text-2xl font-bold sm:text-3xl">Open listings and start comparing hostels.</h2>
          <p className="max-w-md text-sm leading-7 text-white/75">
            Once you know what matters most, jump back to the listings page and filter by budget, distance, and room type.
          </p>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
          <p className="text-sm font-semibold text-white">Helpful cues</p>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>• Check whether the hostel is verified.</li>
            <li>• Compare the first available price across rooms.</li>
            <li>• Use campus distance as a quick shortlist signal.</li>
          </ul>
        </div>
      </section>
    </section>
  );
}
