import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive" | "ghost";
  size?: "default" | "sm";
};

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border bg-card hover:bg-muted",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  ghost: "hover:bg-muted",
};

export function Button({ className, variant = "default", size = "default", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        size === "sm" ? "h-8 px-3" : "h-10 px-4",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
