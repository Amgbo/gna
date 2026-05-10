import { Sparkles } from "lucide-react";
import type { Hostel } from "../../types/hostel";
import { Badge } from "../ui/Badge";

export function HostelHighlights({ hostel }: { hostel: Hostel }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <div className="rounded-xl border border-background/10 bg-background/5 p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-background/50">
            Hostel Highlights
          </p>
          <h2 className="font-display text-xl font-semibold text-background mt-1">
            What Stands Out
          </h2>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20">
          <Sparkles className="h-5 w-5 text-accent" />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {amenities.slice(0, 8).map((amenity) => (
          <Badge
            key={amenity.id}
            variant="outline"
            className="border-background/20 text-background/80"
          >
            {amenity.name}
          </Badge>
        ))}
        {amenities.length === 0 && (
          <p className="text-sm text-background/60">No amenities listed yet.</p>
        )}
      </div>
    </div>
  );
}
