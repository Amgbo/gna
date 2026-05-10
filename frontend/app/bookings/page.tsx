"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import LoadingSkeleton from "../../components/ui/LoadingSkeleton";
import StatusBadge from "../../components/ui/StatusBadge";
import { useAuth } from "../../context/auth";

interface Booking {
  id: string;
  booking_reference: string;
  hostel_name: string;
  academic_year: number;
  semester: number;
  booking_status: string;
  payment_status: string;
  check_in_date: string;
  check_out_date: string;
  total_amount: number;
  currency: string;
  created_at: string;
}

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token, isLoading } = useAuth();

  useEffect(() => {
    async function fetchBookings() {
      try {
        if (isLoading) return;
        if (!token) {
          router.push("/login");
          return;
        }


        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/bookings`, {
          headers: { Authorization: `Bearer ${token}` }
        });


        if (!res.ok) {
          if (res.status === 401) {
            router.push("/login");
            return;
          }
          throw new Error("Failed to fetch bookings");
        }

        const data = await res.json();
        setBookings(data.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [router, token, isLoading]);

  if (loading || isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <LoadingSkeleton lines={3} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-950 sm:text-4xl">My Bookings</h1>
        <p className="mt-2 text-slate-600">Manage your hostel reservations</p>
      </div>

      {error && (
        <div className="mb-6 flex gap-3 rounded-xl bg-red-50 border border-red-200 p-4">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-600 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="soft-card rounded-[28px] p-8 text-center">
          <p className="text-slate-600">No bookings yet.</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Browse hostels
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}>
              <div className="soft-card rounded-[24px] p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
                <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950">{booking.hostel_name}</h3>
                      <p className="text-xs text-slate-600">Ref: {booking.booking_reference}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(booking.check_in_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric"
                          })}{" "}
                          -{" "}
                          {new Date(booking.check_out_date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          Semester {booking.semester}, Year {booking.academic_year}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-950">
                        {booking.currency} {booking.total_amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-600">Total</p>
                    </div>

                    <div className="flex flex-wrap justify-end gap-2">
                      <StatusBadge status={booking.booking_status} kind="booking" />
                      <StatusBadge status={booking.payment_status} kind="payment" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

