import BookButton from "../../components/BookButton";
import type { Hostel } from "../../types/hostel";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function HostelRoomsList({ hostel }: { hostel: Hostel }) {
  return (
    <div className="space-y-4">
      <div>
        <Badge variant="primary" className="mb-2">Available Rooms</Badge>
        <h3 className="font-display text-2xl font-bold text-foreground">
          Choose Your Space
        </h3>
      </div>

      <div className="space-y-4">
        {hostel.rooms?.map((room) => (
          <Card
            key={room.id}
            variant="elevated"
            padding="md"
            className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-xl"
          >
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-semibold text-foreground">
                      {room.type} Room
                    </p>
                    <Badge variant="primary">
                      GHS {Number(room.pricePerSemester).toLocaleString()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{room.availableBeds}</span>
                    {" "}of{" "}
                    <span className="font-medium text-foreground">{room.totalBeds}</span>
                    {" "}beds available
                  </p>
                </div>

                <BookButton
                  roomId={room.id}
                  room={room}
                  hostelId={hostel.id}
                  hostelName={hostel.name}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {(!hostel.rooms || hostel.rooms.length === 0) && (
          <Card padding="lg" className="text-center">
            <CardContent>
              <p className="text-muted-foreground">No rooms available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
