import BookButton from "../../components/BookButton";
import type { Hostel } from "../../types/hostel";

export function HostelRoomsList({ hostel }: { hostel: Hostel }) {
  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rooms</p>
          <h3 className="text-2xl font-bold text-slate-950">Available spaces</h3>
        </div>
      </div>

      <div className="grid gap-4">
        {hostel.rooms?.map((room) => (
          <div
            key={room.id}
            className="soft-card rounded-[24px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold text-slate-950">{room.type} room</p>
                  <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                    GHS {room.pricePerSemester}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  Beds available: {room.availableBeds}/{room.totalBeds}
                </p>
              </div>

              <BookButton roomId={room.id} room={room} hostelId={hostel.id} hostelName={hostel.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

