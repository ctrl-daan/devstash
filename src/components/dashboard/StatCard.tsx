import type { LucideIcon } from "lucide-react";

// A single metric tile in the dashboard stats row.
export function StatCard({
  label,
  value,
  icon: Icon,
  iconColor,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  iconColor?: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <Icon
          className="size-4 text-muted-foreground"
          style={iconColor ? { color: iconColor } : undefined}
        />
      </div>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}