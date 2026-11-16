import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex w-full rounded-md border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40",
        className
      )}
      {...props}
    />
  );
}
