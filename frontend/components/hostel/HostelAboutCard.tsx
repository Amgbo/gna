import type { Hostel } from "../../types/hostel";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function HostelAboutCard({ hostel }: { hostel: Hostel }) {
  const amenities = Array.isArray(hostel.amenities) ? hostel.amenities : [];

  return (
    <Card variant="elevated" padding="lg">
      <CardContent className="space-y-4">
        <Badge variant="secondary">About</Badge>
        <p className="text-muted-foreground leading-relaxed">{hostel.description}</p>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {amenities.slice(0, 6).map((amenity) => (
              <Badge key={amenity.id} variant="default">
                {amenity.name}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
