import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Hostel } from "../../../types/hostel";
import { HostelAboutCard } from "../../../components/hostel/HostelAboutCard";
import { HostelHighlights } from "../../../components/hostel/HostelHighlights";
import { HostelHero } from "../../../components/hostel/HostelHero";
import { HostelRoomsList } from "../../../components/hostel/HostelRoomsList";
import EmptyState from "../../../components/EmptyState";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";

type HostelsResponse = { data: Hostel };

async function getHostel(id: string): Promise<Hostel | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
  try {
    const res = await fetch(`${baseUrl}/api/hostels/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const payload = (await res.json()) as HostelsResponse;
    return payload.data;
  } catch {
    return null;
  }
}

export default async function HostelPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const hostel = await getHostel(id);

  if (!hostel) {
    return (
      <Card variant="elevated" padding="lg">
        <EmptyState
          title="Hostel Not Found"
          description="The hostel you're looking for doesn't exist or may have been removed."
        >
          <Link href="/listings">
            <Button variant="primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </EmptyState>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/listings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      {/* Hero Section */}
      <section className="rounded-2xl bg-foreground p-6 text-background shadow-soft-xl sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
          <HostelHero hostel={hostel} />
          <HostelHighlights hostel={hostel} />
        </div>
      </section>

      {/* Details Section */}
      <section className="grid gap-8 lg:grid-cols-2">
        <HostelAboutCard hostel={hostel} />
        <HostelRoomsList hostel={hostel} />
      </section>
    </div>
  );
}
