import type React from "react";

type StatusBadgeProps = {
  status: string;
  kind?: "booking" | "payment";
  className?: string;
};

function bookingStyles(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "PENDING":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "CHECKED_IN":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "COMPLETED":
      return "bg-slate-50 text-slate-700 border-slate-200";
    case "CANCELLED":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200";
  }
}

function paymentStyles(status: string) {
  switch (status) {
    case "PAID":
      return "bg-emerald-100 text-emerald-800";
    case "PENDING":
      return "bg-amber-100 text-amber-800";
    case "FAILED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function StatusBadge({
  status,
  kind = "booking",
  className = ""
}: StatusBadgeProps) {
  const isBooking = kind === "booking";

  const styles = isBooking ? bookingStyles(status) : paymentStyles(status);

  return (
    <span
      className={
        (isBooking
          ? `inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${styles}`
          : `inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles}`) +
        " " +
        className
      }
    >
      {isBooking ? status.replace(/_/g, " ") : status}
    </span>
  );
}

