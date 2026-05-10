"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Users, Home, Calendar, ShieldCheck, XCircle } from "lucide-react";

type AdminDashboard = {
  summary: {
    totalHostels: number;
    pendingHostels: number;
    verifiedHostels: number;
    totalBookings: number;
    pendingBookings: number;
    totalUsers: number;
    students: number;
    landlords: number;
    admins: number;
  };
  pendingHostels: Array<{
    id: string;
    name: string;
    address: string;
    hostelStatus: string;
    isVerified: boolean;
    createdAt: string;
    landlordName: string;
    roomCount: number;
    minPrice: string;
  }>;
  pendingRooms: Array<{
    id: string;
    roomNumber: string;
    type: string;
    pricePerSemester: string;
    availableBeds: number;
    hostelId: string;
    hostelName: string;
    landlordName: string;
  }>;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard() {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/dashboard/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        router.push("/login");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load admin dashboard");
      }

      const payload = await res.json();
      setData(payload.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function verifyHostel(hostelId: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(`hostel-${hostelId}`);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/dashboard/admin/hostels/${hostelId}/verify`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to verify hostel");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify hostel");
    } finally {
      setActionLoading(null);
    }
  }

  async function rejectHostel(hostelId: string) {
    const reason = window.prompt("Reason for rejection (optional):") ?? "";
    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(`hostel-${hostelId}`);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/dashboard/admin/hostels/${hostelId}/reject`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ reason })
      });
      if (!res.ok) throw new Error("Failed to reject hostel");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reject hostel");
    } finally {
      setActionLoading(null);
    }
  }

  async function verifyRoom(roomId: string) {
    const token = localStorage.getItem("token");
    if (!token) return;

    setActionLoading(`room-${roomId}`);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
      const res = await fetch(`${baseUrl}/api/dashboard/admin/rooms/${roomId}/verify`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to verify room");
      await loadDashboard();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify room");
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return <div className="soft-card rounded-[28px] p-8 text-slate-600">Loading admin dashboard...</div>;
  }

  if (error || !data) {
    return <div className="soft-card rounded-[28px] p-8 text-red-600">{error || "Dashboard not available"}</div>;
  }

  const summaryCards = [
    { label: "Hostels", value: data.summary.totalHostels, icon: Building2 },
    { label: "Users", value: data.summary.totalUsers, icon: Users },
    { label: "Rooms", value: data.pendingRooms.length, icon: Home },
    { label: "Bookings", value: data.summary.totalBookings, icon: Calendar },
    { label: "Pending Hostels", value: data.summary.pendingHostels, icon: ShieldCheck },
    { label: "Pending Bookings", value: data.summary.pendingBookings, icon: XCircle }
  ];

  return (
    <div className="space-y-8">
      <section className="rounded-[36px] bg-slate-950 px-6 py-8 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] sm:px-8">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">Admin Verification Panel</p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Review hostels and rooms</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-white/75">
          Approve hostels, verify rooms, and monitor the health of the platform.
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
          <h2 className="text-2xl font-bold text-slate-950">Pending hostels</h2>
          <div className="mt-4 space-y-3">
            {data.pendingHostels.map((hostel) => (
              <div key={hostel.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{hostel.name}</h3>
                    <p className="text-sm text-slate-600">{hostel.address}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Landlord: {hostel.landlordName} • {hostel.roomCount} rooms • Min price GHS {Number(hostel.minPrice).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => verifyHostel(hostel.id)}
                      disabled={actionLoading === `hostel-${hostel.id}`}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
                    >
                      Verify
                    </button>
                    <button
                      onClick={() => rejectHostel(hostel.id)}
                      disabled={actionLoading === `hostel-${hostel.id}`}
                      className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {data.pendingHostels.length === 0 && <p className="text-sm text-slate-500">No hostels pending approval.</p>}
          </div>
        </div>

        <div className="soft-card rounded-[28px] p-6">
          <h2 className="text-2xl font-bold text-slate-950">Pending rooms</h2>
          <div className="mt-4 space-y-3">
            {data.pendingRooms.map((room) => (
              <div key={room.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">
                      {room.hostelName} - Room {room.roomNumber}
                    </h3>
                    <p className="text-sm text-slate-600">{room.type} • {room.availableBeds} beds available</p>
                    <p className="mt-2 text-xs text-slate-500">Landlord: {room.landlordName} • GHS {Number(room.pricePerSemester).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => verifyRoom(room.id)}
                    disabled={actionLoading === `room-${room.id}`}
                    className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    Verify
                  </button>
                </div>
              </div>
            ))}
            {data.pendingRooms.length === 0 && <p className="text-sm text-slate-500">No rooms pending verification.</p>}
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <Link href="/" className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-50">
          Back to home
        </Link>
      </div>
    </div>
  );
}