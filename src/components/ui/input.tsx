import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border bg-card px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-transparent file:text-sm file:font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
