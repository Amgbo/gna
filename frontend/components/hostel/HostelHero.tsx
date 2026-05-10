import { MapPin, ShieldCheck } from "lucide-react";
import type { Hostel } from "../../types/hostel";

export function HostelHero({ hostel }: { hostel: Hostel }) {
  return (
    <section className="rounded-[36px] bg-slate-950 p-6 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] lg:p-8">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-5">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-300" />
              {hostel.isVerified ? "Verified hostel" : "Pending verification"}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
              <MapPin className="h-4 w-4 text-amber-300" />
              {hostel.distance_from_campus} km from campus
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{hostel.name}</h1>
            <p className="max-w-2xl text-base leading-7 text-white/75">{hostel.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Address</p>
              <p className="mt-2 text-sm text-white/85">{hostel.address}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Rooms</p>
              <p className="mt-2 text-2xl font-semibold">{hostel.rooms?.length ?? 0}</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-white/55">Amenities</p>
              <p className="mt-2 text-2xl font-semibold">{Array.isArray(hostel.amenities) ? hostel.amenities.length : 0}</p>
            </div>
          </div>
        </div>

        <div />
      </div>
    </section>
  );
}

