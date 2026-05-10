"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Calendar, AlertCircle } from "lucide-react";

interface Room {
  id: string;
  type: string;
  pricePerSemester: string;
  totalBeds: number;
  availableBeds: number;
}

interface AcademicTerm {
  id: string;
  year: number;
  term: number;
  title?: string;
}

interface RoomBookingModalProps {
  isOpen: boolean;
  hostelId: string;
  hostelName: string;
  room: Room;
  onClose: () => void;
}

export default function RoomBookingModal({ isOpen, hostelId, hostelName, room, onClose }: RoomBookingModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [terms, setTerms] = useState<AcademicTerm[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string>("");
  const [checkInDate, setCheckInDate] = useState<string>("");
  const [checkOutDate, setCheckOutDate] = useState<string>("");
  const [bedId, setBedId] = useState<string>("");

  // Fetch academic terms on mount
  useEffect(() => {
    if (!isOpen) return;
    
    async function fetchTerms() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/academic-terms`, { cache: "no-store" });

        if (!res.ok) throw new Error("Failed to fetch terms");
        const data = await res.json();
        setTerms(data.data || []);
        // Auto-select first available term
        if (data.data?.length > 0) {
          setSelectedTerm(data.data[0].id);
        }
      } catch (err) {
        setError("Failed to load academic terms");
      }
    }

    fetchTerms();
  }, [isOpen]);

  async function handleBooking() {
    setError(null);

    // Validation
    if (!selectedTerm) {
      setError("Please select an academic term");
      return;
    }
    if (!checkInDate) {
      setError("Please select a check-in date");
      return;
    }
    if (!checkOutDate) {
      setError("Please select a check-out date");
      return;
    }

    // Verify check-out is after check-in
    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError("Check-out date must be after check-in date");
      return;
    }

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/bookings`, {
        
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          academic_term_id: selectedTerm,
          hostel_id: hostelId,
          room_id: room.id,
          bed_id: bedId || undefined,
          check_in_date: checkInDate,
          check_out_date: checkOutDate
        })
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        setError(payload.message || "Booking failed");
        return;
      }

      const payload = await res.json();
      // Redirect to booking details or confirmation page
      router.push(`/bookings/${payload.data.id}`);
      onClose();
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  const selectedTermData = terms.find((t) => t.id === selectedTerm);
  const unitPrice = parseFloat(room.pricePerSemester);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition"
        onClick={onClose}
        aria-hidden
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
        <div
          className="relative w-full max-w-md rounded-[28px] border border-slate-200 bg-white shadow-[0_40px_100px_rgba(15,23,42,0.15)]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-950">Book this room</h2>
              <p className="mt-1 text-xs text-slate-600">{hostelName}</p>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-slate-100 transition"
              aria-label="Close modal"
            >
              <X className="h-5 w-5 text-slate-600" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-5 space-y-5">
            {/* Room summary */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-slate-600">
                {room.type} room
              </p>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-sm text-slate-700">
                  GHS {room.pricePerSemester} per semester
                </p>
                <span className="text-xs font-semibold text-slate-600">
                  {room.availableBeds} bed{room.availableBeds !== 1 ? "s" : ""} available
                </span>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="flex gap-3 rounded-xl bg-red-50 border border-red-200 p-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Academic term selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Academic Term <span className="text-red-600">*</span>
              </label>
              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
              >
                <option value="">Select a term</option>
                {terms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.title || `Year ${term.year}, Semester ${term.term}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Check-in date */}
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Calendar className="h-4 w-4" />
                Check-in Date <span className="text-red-600">*</span>
              </div>
              <input
                type="date"
                value={checkInDate}
                aria-label="Check-in Date"
                onChange={(e) => setCheckInDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
              />
            </div>

            {/* Check-out date */}
            <div>
              <div className="mb-2 flex items-center gap-1 text-sm font-semibold text-slate-700">
                <Calendar className="h-4 w-4" />
                Check-out Date <span className="text-red-600">*</span>
              </div>
              <input
                type="date"
                value={checkOutDate}
                aria-label="Check-out Date"
                onChange={(e) => setCheckOutDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
              />
            </div>

            {/* Price preview */}
            {checkInDate && checkOutDate && (
              <div className="rounded-xl bg-brand-50 border border-brand-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-700">
                  Total Cost
                </p>
                <p className="mt-1 text-2xl font-bold text-brand-900">
                  GHS {unitPrice.toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-brand-700">
                  This is a semester-based booking
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-slate-200 px-6 py-4 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleBooking}
              disabled={loading || !selectedTerm || !checkInDate || !checkOutDate}
              className="flex-1 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
