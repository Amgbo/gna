"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Calendar, DollarSign, Home, ShieldCheck, Users } from "lucide-react";

type LandlordDashboard = {
  summary: {
    totalHostels: number;
    verifiedHostels: number;
    pendingHostels: number;
    totalRooms: number;
    pendingRooms: number;
    totalBookings: number;
    pendingBookings: number;
    revenue: string;
  };
  hostels: Array<{
    id: string;
    name: string;
    address: string;
    isVerified: boolean;
    hostelStatus: string;
    createdAt: string;
    roomCount: number;
    pendingRoomCount: number;
    minPrice: string;
    bookingCount: number;
  }>;
  bookings: Array<{
    id: string;
    bookingReference: string;
    bookingStatus: string;
    paymentStatus: string;
    totalAmount: string;
    currency: string;
    createdAt: string;
    studentName: string;
    hostelName: string;
  }>;
};

export default function LandlordDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<LandlordDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
        const res = await fetch(`${baseUrl}/api/dashboard/landlord`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          router.push("/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to load landlord dashboard");
        }

        const payload = await res.json();
        setData(payload.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return <div className="soft-card rounded-[28px] p-8 text-slate-600">Loading landlord dashboard...</div>;
  }

  if (error || !data) {
    return <div className="soft-card rounded-[28px] p-8 text-red-600">{error || "Dashboard not available"}</div>;
  }

  const summaryCards = [
    { label: "Hostels", value: data.summary.totalHostels, icon: Building2 },
    { label: "Rooms", value: data.summary.totalRooms, icon: Home },
    { label: "Bookings", value: data.summary.totalBookings, icon: Calendar },
    { label: "Revenue", value: `GHS ${Number(data.summary.revenue).toLocaleString()}`, icon: DollarSign },
    { label: "Pending Rooms", value: data.summary.pendingRooms, icon: ShieldCheck },
    { label: "Pending Bookings", value: data.summary.pendingBookings, icon: Users }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-slate-950 px-6 py-8 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Landlord Dashboard</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Manage your properties and bookings</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
          Track verification status, revenue, and booking activity across your hostels.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="soft-card rounded-[24px] p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{card.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{card.value}</p>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon className="h-5 w-5" />
                </span>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="soft-card rounded-[28px] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Your hostels</p>
              <h2 className="text-2xl font-bold text-slate-950">Managed properties</h2>
            </div>
          </div>
          <div className="space-y-3">
            {data.hostels.map((hostel) => (
              <div key={hostel.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{hostel.name}</h3>
                    <p className="text-sm text-slate-600">{hostel.address}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {hostel.roomCount} rooms • {hostel.bookingCount} bookings • Min price GHS {Number(hostel.minPrice).toLocaleString()}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hostel.isVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                    {hostel.isVerified ? "Verified" : hostel.hostelStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
            {data.hostels.length === 0 && <p className="text-sm text-slate-500">No hostels created yet.</p>}
          </div>
        </div>

        <div className="soft-card rounded-[28px] p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Recent activity</p>
              <h2 className="text-2xl font-bold text-slate-950">Latest bookings</h2>
            </div>
          </div>
          <div className="space-y-3">
            {data.bookings.map((booking) => (
              <div key={booking.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{booking.studentName}</h3>
                    <p className="text-sm text-slate-600">{booking.hostelName}</p>
                    <p className="mt-2 text-xs text-slate-500">{booking.bookingReference}</p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-slate-950">
                      {booking.currency} {Number(booking.totalAmount).toLocaleString()}
                    </p>
                    <p className="text-slate-500">{booking.bookingStatus.replace(/_/g, " ")}</p>
                  </div>
                </div>
              </div>
            ))}
            {data.bookings.length === 0 && <p className="text-sm text-slate-500">No recent bookings.</p>}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Link href="/bookings" className="rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
          View student bookings
        </Link>
      </div>
    </div>
  );
}