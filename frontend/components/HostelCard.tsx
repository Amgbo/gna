import Link from "next/link";
import { MapPin, CheckCircle2 } from "lucide-react";
import type { Hostel } from "../types/hostel";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

type HostelCardProps = {
  hostel: Hostel;
};

function formatPrice(price: string): string {
  const value = Number(price);
  return Number.isNaN(value)
    ? "N/A"
    : new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        maximumFractionDigits: 0
      }).format(value);
}

export default function HostelCard({ hostel }: HostelCardProps): JSX.Element {
  const lowestPrice = hostel.rooms[0]?.pricePerSemester ?? "0";
  const roomsCount = hostel.rooms.length;

  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-card shadow-soft-sm transition duration-300 hover:shadow-soft-lg hover:-translate-y-0.5">
      {/* Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

        {/* Status Badge */}
        <div className="absolute left-3 top-3">
          {hostel.isVerified ? (
            <Badge variant="success" className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="warning">New</Badge>
          )}
        </div>

        {/* Price Badge */}
        <div className="absolute right-3 top-3 rounded-md bg-foreground/80 px-2.5 py-1 text-xs font-semibold text-background backdrop-blur-sm">
          From {formatPrice(lowestPrice)}
        </div>

        {/* Room Count Overlay */}
        <div className="absolute bottom-3 left-3 rounded-md bg-background/90 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {roomsCount} {roomsCount === 1 ? "room" : "rooms"} available
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-4 p-4">
        {/* Header */}
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground line-clamp-1">
            {hostel.name}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {hostel.description}
          </p>
        </div>

        {/* Amenities */}
        {hostel.amenities && hostel.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {hostel.amenities.slice(0, 3).map((amenity) => (
              <Badge key={amenity.id} variant="default">
                {amenity.name}
              </Badge>
            ))}
            {hostel.amenities.length > 3 && (
              <Badge variant="outline">+{hostel.amenities.length - 3}</Badge>
            )}
          </div>
        )}

        {/* Price and Location */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              From
            </p>
            <p className="text-base font-semibold text-primary">
              {formatPrice(lowestPrice)}
              <span className="text-xs font-normal text-muted-foreground">
                {" "}
                / semester
              </span>
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{hostel.distance_from_campus} km</span>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/hostel/${hostel.id}`} className="w-full">
          <Button variant="primary" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </article>
  );
}
