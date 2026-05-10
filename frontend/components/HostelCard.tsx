import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Hostel } from "../types/hostel";

type HostelCardProps = {
  hostel: Hostel;
};

function formatPrice(price: string): string {
  const value = Number(price);
  return Number.isNaN(value)
    ? "N/A"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(value);
}

export default function HostelCard({ hostel }: HostelCardProps): JSX.Element {
  const lowestPrice = hostel.rooms[0]?.pricePerSemester ?? "0";
  const roomsCount = hostel.rooms.length;
  const amenityCount = hostel.amenities?.length ?? 0;

  return (
    <article className="group overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
      <div className="relative h-52 w-full overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center transition duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 shadow-sm backdrop-blur">
          <span className={`h-2 w-2 rounded-full ${hostel.isVerified ? "bg-emerald-500" : "bg-amber-500"}`} />
          {hostel.isVerified ? "Verified" : "New listing"}
        </div>
        <div className="absolute right-4 top-4 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          From {formatPrice(lowestPrice)}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
          <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            {roomsCount} rooms
          </div>
          <div className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium backdrop-blur">
            {amenityCount} amenities
          </div>
        </div>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-slate-950">{hostel.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{hostel.description}</p>
            </div>
            <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-semibold text-white">
              {roomsCount} rooms
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {hostel.amenities?.slice(0, 3).map((amenity) => (
              <span key={amenity.id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                {amenity.name}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">From</p>
            <p className="text-lg font-semibold text-brand-700">{formatPrice(lowestPrice)} / semester</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
            <MapPin className="h-4 w-4" />
            {hostel.distance_from_campus} km away
          </div>
        </div>

        <Link
          href={`/hostel/${hostel.id}`}
          className="inline-flex w-full items-center justify-center rounded-full bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          View hostel
        </Link>
      </div>
    </article>
  );
}
