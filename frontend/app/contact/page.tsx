import { Mail, MapPin, PhoneCall, Sparkles } from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "support@gnahostels.com",
    description: "For booking support and account help"
  },
  {
    icon: PhoneCall,
    label: "Phone",
    value: "+233 000 000 000",
    description: "For urgent questions and verification updates"
  },
  {
    icon: MapPin,
    label: "Coverage",
    value: "Campus focused",
    description: "Built for student housing searches across Ghana"
  }
];

export default function ContactPage(): JSX.Element {
  return (
    <section className="space-y-8 pb-8">
      <section className="rounded-[36px] bg-slate-950 p-6 text-white shadow-[0_40px_100px_rgba(15,23,42,0.2)] lg:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">Contact</p>
        <h1 className="mt-2 text-4xl font-bold sm:text-5xl">Talk to the team.</h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/75">
          Use this page when you need booking support, need a hostel verified, or want help finding the right housing option near campus.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <article key={item.label} className="soft-card rounded-[28px] p-6">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-6 rounded-[32px] border border-white/70 bg-white/82 p-6 shadow-[0_30px_90px_rgba(15,23,42,0.08)] lg:grid-cols-[0.92fr_1.08fr] lg:p-8">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Support</p>
          <h2 className="text-2xl font-bold text-slate-950 sm:text-3xl">Need a faster response?</h2>
          <p className="max-w-md text-sm leading-7 text-slate-600">
            Share what you are trying to do, and we can point you to the right hostel, the right booking flow, or the right dashboard area.
          </p>
        </div>

        <div className="rounded-[28px] bg-slate-950 p-5 text-white">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/55">
            <Sparkles className="h-4 w-4" />
            Quick help
          </div>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/75">
            <p>• Use Listings to compare verified hostels.</p>
            <p>• Use Dashboard if you are already signed in and need your role-specific view.</p>
            <p>• Use Bookings to review your reservations after login.</p>
          </div>
        </div>
      </section>
    </section>
  );
}
