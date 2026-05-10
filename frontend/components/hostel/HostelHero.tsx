import { MapPin, ShieldCheck } from "lucide-react";
import type { Hostel } from "../../types/hostel";
import { Badge } from "../ui/Badge";

export function HostelHero({ hostel }: { hostel: Hostel }) {
  return (
    <div className="space-y-5">
      {/* Status Badges */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge
          variant={hostel.isVerified ? "success" : "warning"}
          className="flex items-center gap-1.5 bg-background/10 border-background/20"
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          {hostel.isVerified ? "Verified Hostel" : "Pending Verification"}
        </Badge>
        <Badge
          variant="default"
          className="flex items-center gap-1.5 bg-background/10 border-background/20 text-background"
        >
          <MapPin className="h-3.5 w-3.5" />
          {hostel.distance_from_campus} km from campus
        </Badge>
      </div>

      {/* Title & Description */}
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-bold leading-tight text-background sm:text-4xl lg:text-5xl">
          {hostel.name}
        </h1>
        <p className="max-w-2xl text-background/70 leading-relaxed">
          {hostel.description}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-background/10 bg-background/5 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-background/50">Address</p>
          <p className="mt-1 text-sm text-background/80">{hostel.address}</p>
        </div>
        <div className="rounded-xl border border-background/10 bg-background/5 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-background/50">Rooms</p>
          <p className="mt-1 text-2xl font-bold text-background">
            {hostel.rooms?.length ?? 0}
          </p>
        </div>
        <div className="rounded-xl border border-background/10 bg-background/5 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-wide text-background/50">Amenities</p>
          <p className="mt-1 text-2xl font-bold text-background">
            {Array.isArray(hostel.amenities) ? hostel.amenities.length : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
