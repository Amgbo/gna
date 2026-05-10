"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoomBookingModal from "./RoomBookingModal";

interface Room {
  id: string;
  type: string;
  pricePerSemester: string;
  totalBeds: number;
  availableBeds: number;
}

interface BookButtonProps {
  roomId: string;
  room: Room;
  hostelId: string;
  hostelName: string;
}

export default function BookButton({ roomId, room, hostelId, hostelName }: BookButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
      >
        Book now
        <ArrowRight className="h-4 w-4" />
      </button>

      <RoomBookingModal
        isOpen={isModalOpen}
        hostelId={hostelId}
        hostelName={hostelName}
        room={room}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
