"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import HostelCard from "./HostelCard";
import EmptyState from "./EmptyState";
import { HostelGridSkeleton } from "./LoadingSkeleton";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { Badge } from "./ui/Badge";
import type { Hostel } from "../types/hostel";

const roomTypeOptions = [
  { value: "", label: "Any type" },
  { value: "SINGLE", label: "Single room" },
  { value: "SHARED", label: "Shared room" }
];

const sortOptions = [
  { value: "", label: "Default" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "distance_asc", label: "Distance: Nearest" },
  { value: "distance_desc", label: "Distance: Farthest" }
];

interface SearchFilters {
  query: string;
  minPrice: string;
  maxPrice: string;
  maxDistance: string;
  roomType: "" | "SINGLE" | "SHARED";
  verifiedOnly: boolean;
  sort: "" | "price_asc" | "price_desc" | "distance_asc" | "distance_desc";
}

const initialFilters: SearchFilters = {
  query: "",
  minPrice: "",
  maxPrice: "",
  maxDistance: "",
  roomType: "",
  verifiedOnly: false,
  sort: ""
};

export default function SearchAndResults() {
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);

  const activeFilterCount = [
    filters.minPrice,
    filters.maxPrice,
    filters.maxDistance,
    filters.roomType,
    filters.verifiedOnly,
    filters.sort
  ].filter(Boolean).length;

  function updateFilter<K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  function resetFilters() {
    setFilters(initialFilters);
    void fetchHostels();
  }

  async function fetchHostels(params?: Record<string, string | number | undefined>) {
    setLoading(true);
    try {
      const url = new URL(
        (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000") + "/api/hostels"
      );
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
    } catch {
      setHostels([]);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    fetchHostels({
      q: filters.query || undefined,
      minPrice: filters.minPrice || undefined,
      maxPrice: filters.maxPrice || undefined,
      maxDistance: filters.maxDistance || undefined,
      roomType: filters.roomType || undefined,
      verified: filters.verifiedOnly || undefined,
      sort: filters.sort || undefined
    });
  }

  useEffect(() => {
    fetchHostels();
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <form
        onSubmit={handleSearch}
        className="rounded-lg border border-border bg-card p-4 shadow-soft-sm sm:p-6"
      >
        {/* Main Search Row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Input
              placeholder="Search by campus, hostel name, or location..."
              value={filters.query}
              onChange={(e) => updateFilter("query", e.target.value)}
              leftIcon={<Search className="h-4 w-4" />}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" variant="primary">
              <Search className="h-4 w-4" />
              Search
            </Button>

            <Button
              type="button"
              variant={showFilters ? "secondary" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="primary" className="ml-1">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 border-t border-border pt-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Min Price (GHS)"
                placeholder="0"
                inputMode="numeric"
                value={filters.minPrice}
                onChange={(e) => updateFilter("minPrice", e.target.value)}
              />

              <Input
                label="Max Price (GHS)"
                placeholder="5000"
                inputMode="numeric"
                value={filters.maxPrice}
                onChange={(e) => updateFilter("maxPrice", e.target.value)}
              />

              <Input
                label="Max Distance (km)"
                placeholder="3"
                inputMode="decimal"
                value={filters.maxDistance}
                onChange={(e) => updateFilter("maxDistance", e.target.value)}
              />

              <Select
                label="Room Type"
                options={roomTypeOptions}
                value={filters.roomType}
                onChange={(e) =>
                  updateFilter("roomType", e.target.value as SearchFilters["roomType"])
                }
              />

              <Select
                label="Sort By"
                options={sortOptions}
                value={filters.sort}
                onChange={(e) =>
                  updateFilter("sort", e.target.value as SearchFilters["sort"])
                }
              />

              <div className="flex items-end">
                <label className="flex h-10 cursor-pointer items-center gap-3 rounded-lg border border-input bg-card px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  <input
                    type="checkbox"
                    checked={filters.verifiedOnly}
                    onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                    className="h-4 w-4 rounded border-input accent-primary"
                  />
                  Verified Only
                </label>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={resetFilters}
                  className="text-muted-foreground"
                >
                  <X className="h-4 w-4" />
                  Clear Filters
                </Button>
              </div>
            </div>
          </div>
        )}
      </form>

      {/* Results */}
      <div>
        {loading ? (
          <HostelGridSkeleton count={6} />
        ) : hostels.length === 0 ? (
          <EmptyState
            icon={<Search className="h-8 w-8" />}
            title="No hostels found"
            description="Try adjusting your search criteria or removing some filters to see more results."
            action={{
              label: "Clear Filters",
              onClick: resetFilters
            }}
          />
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{hostels.length}</span>{" "}
                {hostels.length === 1 ? "hostel" : "hostels"}
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {hostels.map((h) => (
                <HostelCard key={h.id} hostel={h} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
