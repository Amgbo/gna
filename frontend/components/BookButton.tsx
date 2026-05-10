"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import RoomBookingModal from "./RoomBookingModal";
import { Button } from "./ui/Button";

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
      <Button
        variant="primary"
        onClick={() => setIsModalOpen(true)}
        rightIcon={<ArrowRight className="h-4 w-4" />}
      >
        Book Now
      </Button>

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
