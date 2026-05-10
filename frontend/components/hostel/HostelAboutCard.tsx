import type { Hostel } from "../../types/hostel";

export function HostelAboutCard({ hostel }: { hostel: Hostel }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="soft-card rounded-[28px] p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">About</p>
      <p className="mt-3 text-sm leading-7 text-slate-600">{hostel.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {amenities.slice(0, 6).map((amenity) => (
          <span key={amenity.id} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
            {amenity.name}
          </span>
        ))}
      </div>
    </div>
  );
}

