import SearchAndResults from "../../components/SearchAndResults";
import { Filter, MapPinned, Sparkles } from "lucide-react";

export default function ListingsPage(): JSX.Element {
  return (
    <section className="space-y-8 pb-8">
      <section className="grid gap-6 rounded-[36px] bg-slate-950 p-6 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Listings</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Compare verified hostels in one place.</h1>
          <p className="max-w-xl text-sm leading-7 text-white/75">
            Use filters to narrow by price, distance, room type, and verification. The listings page is built for fast comparisons and confident booking.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[
            [Sparkles, "Verified only", "Focus on trusted listings"],
            [Filter, "Smart filters", "Find the right room faster"],
            [MapPinned, "Campus aware", "Sort by distance to campus"]
          ].map(([Icon, title, description]) => {
            const IconComponent = Icon as typeof Sparkles;

            return (
              <div key={title as string} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <IconComponent className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-white">{title as string}</p>
                <p className="mt-1 text-xs leading-5 text-white/65">{description as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <SearchAndResults />
    </section>
  );
}
