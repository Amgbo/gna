"use client";

import { useEffect, useState } from "react";
import HostelCard from "./HostelCard";
import type { Hostel } from "../types/hostel";
import { Search } from "lucide-react";

export default function SearchAndResults() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState("");
  const [roomType, setRoomType] = useState<"" | "SINGLE" | "SHARED">("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sort, setSort] = useState<"" | "price_asc" | "price_desc" | "distance_asc" | "distance_desc">("");

  function resetFilters() {
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
    setMaxDistance("");
    setRoomType("");
    setVerifiedOnly(false);
    setSort("");
    void fetchHostels();
  }

  async function fetchHostels(params?: Record<string, string | number | undefined>) {
    setLoading(true);
    try {
      const url = new URL((process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/hostels");
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
        });
      }

      const res = await fetch(url.toString(), { cache: "no-store" });
      if (!res.ok) {
        setHostels([]);
      } else {
        const payload = await res.json();
        setHostels(payload.data || []);
      }
    } catch (err) {
      setHostels([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // initial load
    fetchHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchHostels({ q: query, minPrice: minPrice || undefined, maxPrice: maxPrice || undefined, maxDistance: maxDistance || undefined, roomType: roomType || undefined, verified: verifiedOnly || undefined, sort: sort || undefined });
        }}
        className="glass-panel flex flex-col gap-4 rounded-[32px] p-4 sm:p-5 lg:p-6"
      >
        <div className="flex flex-col gap-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Search & filter</p>
          <h3 className="text-xl font-bold text-slate-950 sm:text-2xl">Tune the listings to your campus and budget</h3>
        </div>

        <div className="grid flex-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          <label className="xl:col-span-2">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Search</span>
            <input
              aria-label="Search campus or address"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Campus area, hostel name, or address"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Min price</span>
            <input
              aria-label="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0"
              inputMode="numeric"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Max price</span>
            <input
              aria-label="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="5000"
              inputMode="numeric"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Max distance</span>
            <input
              aria-label="Max distance (km)"
              value={maxDistance}
              onChange={(e) => setMaxDistance(e.target.value)}
              placeholder="3 km"
              inputMode="decimal"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            />
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Room type</span>
            <select
              aria-label="Room type"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value as any)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
            >
              <option value="">Any type</option>
              <option value="SINGLE">Single</option>
              <option value="SHARED">Shared</option>
            </select>
          </label>

          <label className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified only
          </label>

          <label>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sort</span>
            <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value as any)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-50">
              <option value="">Sort</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
              <option value="distance_asc">Distance: near to far</option>
              <option value="distance_desc">Distance: far to near</option>
            </select>
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800" type="submit">
            <Search className="h-4 w-4" />
            Search hostels
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
          >
            Reset filters
          </button>
        </div>
      </form>

      <div>
        {loading ? (
          <div className="glass-panel rounded-[24px] p-6 text-sm text-slate-500">Loading hostels...</div>
        ) : hostels.length === 0 ? (
          <div className="soft-card rounded-[24px] p-6 text-sm text-slate-500">No hostels found. Try widening your search or removing filters.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {hostels.map((h) => (
              <HostelCard key={h.id} hostel={h} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
