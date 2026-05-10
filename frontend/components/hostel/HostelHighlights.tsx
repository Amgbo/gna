import { Sparkles } from "lucide-react";
import type { Hostel } from "../../types/hostel";

export function HostelHighlights({ hostel }: { hostel: Hostel }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="rounded-[32px] border border-white/10 bg-white/10 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/55">Hostel highlights</p>
          <h2 className="mt-1 text-xl font-semibold">What stands out</h2>
        </div>
        <Sparkles className="h-5 w-5 text-amber-300" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {amenities.slice(0, 8).map((amenity) => (
          <span
            key={amenity.id}
            className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-white/85"
          >
            {amenity.name}
          </span>
        ))}
        {amenities.length === 0 && <p className="text-sm text-white/65">No amenities listed yet.</p>}
      </div>
    </div>
  );
}

