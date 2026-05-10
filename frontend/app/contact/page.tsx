import Link from "next/link";
import { Mail, MapPin, Phone, MessageSquare, ArrowRight } from "lucide-react";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

const contactMethods = [
  {
    icon: Mail,
    label: "Email",
    value: "support@gnahostels.com",
    description: "For booking support and account help"
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+233 000 000 000",
    description: "For urgent questions and verification"
  },
  {
    icon: MapPin,
    label: "Coverage",
    value: "Ghana-wide",
    description: "Serving students across all campuses"
  }
];

const quickLinks = [
  { label: "Use Listings to compare verified hostels", href: "/listings" },
  { label: "Use Dashboard if you need your role-specific view", href: "/dashboard" },
  { label: "Use Bookings to review your reservations", href: "/bookings" }
];

export default function ContactPage(): JSX.Element {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="rounded-2xl bg-foreground p-6 text-background sm:p-8">
        <Badge variant="outline" className="border-background/20 text-background/80 mb-4">
          Contact Us
        </Badge>
        <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
          Talk to the team
        </h1>
        <p className="mt-4 max-w-2xl text-background/70 leading-relaxed">
          Use this page when you need booking support, need a hostel verified, or
          want help finding the right housing option near campus.
        </p>
      </section>

      {/* Contact Methods */}
      <section className="grid gap-4 sm:grid-cols-3">
        {contactMethods.map((method) => {
          const Icon = method.icon;
          return (
            <Card key={method.label} variant="elevated" padding="lg">
              <CardContent className="space-y-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    {method.label}
                  </p>
                  <p className="font-display text-xl font-bold text-foreground mt-1">
                    {method.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {method.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      {/* Quick Help Section */}
      <section className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <Card padding="lg">
          <CardContent className="space-y-4">
            <Badge variant="default">Support</Badge>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Need a faster response?
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Share what you are trying to do, and we can point you to the right
              hostel, the right booking flow, or the right dashboard area.
            </p>
            <Link href="mailto:support@gnahostels.com">
              <Button variant="primary">
                <MessageSquare className="h-4 w-4" />
                Send a Message
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card padding="lg" className="bg-muted/50">
          <CardContent className="space-y-4">
            <p className="font-semibold text-foreground">Quick Navigation</p>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center justify-between rounded-lg bg-card p-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
