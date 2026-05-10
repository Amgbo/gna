"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Calendar, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "../../../components/ui/LoadingSkeleton";
import StatusBadge from "../../../components/ui/StatusBadge";
import { useAuth } from "../../../context/auth";

interface BookingDetail {
  id: string;
  booking_reference: string;
  student_id: string;
  hostel_name: string;
  hostel_address: string;
  academic_year: number;
  semester: number;
  booking_status: string;
  payment_status: string;
  check_in_date: string;
  check_out_date: string;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  currency: string;
  notes?: string;
  created_at: string;
  items?: Array<{
    id: string;
    item_type: string;
    room_id: string;
    bed_id?: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;
}

export default function BookingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, isLoading: authLoading } = useAuth();


  useEffect(() => {
    async function fetchBooking() {
      try {
        if (authLoading) return;
        if (!token) {
          router.push("/login");
          return;
        }


        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/bookings/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          if (res.status === 404) {
            setError("Booking not found");
            return;
          }
          throw new Error("Failed to fetch booking");
        }

        const data = await res.json();
        setBooking(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load booking");
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [bookingId, router, token, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="mx-auto max-w-3xl">
        <LoadingSkeleton lines={4} />
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="mx-auto max-w-3xl">
        <Link
          href="/bookings"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bookings
        </Link>
        <div className="flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error || "Booking not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <Link
        href="/bookings"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-950 transition"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Link>

      {/* Booking status */}
      <div className="mb-8 grid gap-4 rounded-[28px] bg-slate-950 text-white p-6 lg:grid-cols-2 lg:gap-8">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Booking reference</p>
            <p className="mt-1 text-2xl font-bold">{booking.booking_reference}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Hostel</p>
            <p className="mt-1 text-lg font-semibold">{booking.hostel_name}</p>
            <p className="text-sm text-white/70">{booking.hostel_address}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Status</p>
            <div className="mt-2 flex items-center gap-2">
              <StatusBadge status={booking.booking_status} kind="booking" />
              <StatusBadge
                status={booking.payment_status}
                kind="payment"
                className="bg-white/20 text-white border-transparent"
              />
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">Created</p>
            <p className="mt-1 text-sm text-white/85">
              {new Date(booking.created_at).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Booking details grid */}
      <div className="grid gap-4 md:grid-cols-2 mb-8">
        {/* Check-in/out dates */}
        <div className="soft-card rounded-[24px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="h-5 w-5 text-slate-600" />
            <h3 className="font-semibold text-slate-950">Duration</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-[0.1em]">Check-in</p>
              <p className="font-semibold text-slate-950">
                {new Date(booking.check_in_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-600 uppercase tracking-[0.1em]">Check-out</p>
              <p className="font-semibold text-slate-950">
                {new Date(booking.check_out_date).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Academic term */}
        <div className="soft-card rounded-[24px] p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="h-5 w-5 text-slate-600" />
            <h3 className="font-semibold text-slate-950">Academic Term</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">
              Year <span className="font-semibold text-slate-950">{booking.academic_year}</span>
            </p>
            <p className="text-slate-600">
              Semester <span className="font-semibold text-slate-950">{booking.semester}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Booking items */}
      {booking.items && booking.items.length > 0 && (
        <div className="soft-card rounded-[24px] p-5 mb-8">
          <h3 className="font-semibold text-slate-950 mb-4">Booking Items</h3>
          <div className="space-y-3">
            {booking.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-950">
                    {item.item_type === "ROOM" ? "Room" : `Bed ${item.bed_id}`}
                  </p>
                  <p className="text-xs text-slate-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-950">
                    GHS {item.subtotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-600">@ GHS {item.unit_price.toLocaleString()} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price breakdown */}
      <div className="soft-card rounded-[24px] p-5">
        <h3 className="font-semibold text-slate-950 mb-4">Price Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-slate-200">
            <p className="text-sm text-slate-600">Subtotal</p>
            <p className="font-semibold text-slate-950">
              {booking.currency} {booking.subtotal_amount.toLocaleString()}
            </p>
          </div>

          {booking.discount_amount > 0 && (
            <div className="flex justify-between items-center py-2 border-b border-slate-200">
              <p className="text-sm text-slate-600">Discount</p>
              <p className="font-semibold text-emerald-600">
                -{booking.currency} {booking.discount_amount.toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex justify-between items-center py-3 bg-brand-50 rounded-lg px-3">
            <p className="font-semibold text-slate-950">Total</p>
            <p className="text-xl font-bold text-brand-700">
              {booking.currency} {booking.total_amount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {booking.notes && (
        <div className="soft-card rounded-[24px] p-5 mt-8 bg-slate-50">
          <p className="text-xs uppercase tracking-[0.1em] text-slate-600 font-semibold">Notes</p>
          <p className="mt-2 text-sm text-slate-700">{booking.notes}</p>
        </div>
      )}
    </div>
  );
}
