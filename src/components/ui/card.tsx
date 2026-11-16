import { cn } from "@/lib/utils";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...p }: DivProps) => (
  <div className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...p} />
);
export const CardHeader = ({ className, ...p }: DivProps) => (
  <div className={cn("p-5 pb-2", className)} {...p} />
);
export const CardTitle = ({ className, ...p }: DivProps) => (
  <h3 className={cn("text-base font-semibold", className)} {...p} />
);
export const CardContent = ({ className, ...p }: DivProps) => (
  <div className={cn("p-5 pt-3", className)} {...p} />
);
