import type { Hostel } from "../../../types/hostel";
import { HostelAboutCard } from "../../../components/hostel/HostelAboutCard";
import { HostelHighlights } from "../../../components/hostel/HostelHighlights";
import { HostelHero } from "../../../components/hostel/HostelHero";
import { HostelRoomsList } from "../../../components/hostel/HostelRoomsList";

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

export default async function HostelPage({ params }: { params: { id: string } }) {
  const hostel = await getHostel(params.id);

  if (!hostel) {
    return <div className="soft-card rounded-[28px] p-8 text-slate-600">Hostel not found</div>;
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[36px] bg-slate-950 p-6 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
        <HostelHero hostel={hostel} />
        <HostelHighlights hostel={hostel} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <HostelAboutCard hostel={hostel} />
        <HostelRoomsList hostel={hostel} />
      </section>
    </div>
  );
}

