import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "flex h-10 w-full rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
        className
      )}
      {...props}
    />
  );
}
