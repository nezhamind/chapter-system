import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { statusLabels, type TaskStatus } from "@/types";

const styles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-700",
  in_progress: "bg-amber-100 text-amber-800",
  done: "bg-emerald-100 text-emerald-800",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return <Badge className={cn(styles[status])}>{statusLabels[status]}</Badge>;
}
