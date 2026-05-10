"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, AlertCircle, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { PageSkeleton } from "../../components/LoadingSkeleton";
import EmptyState from "../../components/EmptyState";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
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

function getBookingStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "success";
    case "pending":
      return "warning";
    case "cancelled":
      return "destructive";
    default:
      return "default";
  }
}

function getPaymentStatusVariant(status: string) {
  switch (status.toLowerCase()) {
    case "paid":
      return "success";
    case "pending":
      return "warning";
    case "failed":
      return "destructive";
    default:
      return "default";
  }
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
        <PageSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="primary" className="mb-3">My Bookings</Badge>
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">
          Your Reservations
        </h1>
        <p className="mt-2 text-muted-foreground">
          View and manage your hostel bookings.
        </p>
      </div>

      {/* Error */}
      {error && (
        <Card padding="md" className="mb-6 border-destructive/20 bg-destructive/5">
          <CardContent className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {bookings.length === 0 ? (
        <Card variant="elevated" padding="lg">
          <EmptyState
            icon={<CalendarCheck className="h-8 w-8" />}
            title="No bookings yet"
            description="You haven't made any reservations yet. Start browsing hostels to find your perfect accommodation."
            action={{
              label: "Browse Hostels",
              onClick: () => router.push("/listings")
            }}
          />
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Link key={booking.id} href={`/bookings/${booking.id}`}>
              <Card
                variant="elevated"
                padding="md"
                className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-xl cursor-pointer"
              >
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-3">
                      {/* Hostel Name & Reference */}
                      <div>
                        <h3 className="font-display text-lg font-semibold text-foreground">
                          {booking.hostel_name}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          Ref: {booking.booking_reference}
                        </p>
                      </div>

                      {/* Dates & Semester */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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

                    {/* Amount & Status */}
                    <div className="flex flex-col items-end justify-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-foreground">
                          GHS {booking.total_amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        <Badge variant={getBookingStatusVariant(booking.booking_status) as "success" | "warning" | "destructive" | "default"}>
                          {booking.booking_status}
                        </Badge>
                        <Badge variant={getPaymentStatusVariant(booking.payment_status) as "success" | "warning" | "destructive" | "default"}>
                          {booking.payment_status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
