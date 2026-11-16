import Link from "next/link";
import { StatusBadge } from "./status-badge";
import { formatDate, isOverdue, cn } from "@/lib/utils";
import type { TaskRow } from "@/types";

export function assigneeLabel(t: TaskRow) {
  if (t.assignee) return t.assignee.name;
  if (t.division) return `Divisi ${t.division.division_name}`;
  return "-";
}

export function TaskList({ tasks, empty = "Belum ada tugas." }: { tasks: TaskRow[]; empty?: string }) {
  if (!tasks.length) {
    return <p className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">{empty}</p>;
  }
  return (
    <div className="divide-y rounded-lg border bg-card">
      {tasks.map((t) => (
        <Link
          key={t.id}
          href={`/tasks/${t.id}`}
          className="flex flex-col gap-2 p-4 transition-colors hover:bg-muted/50 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{t.title}</p>
            <p className="text-xs text-muted-foreground">Untuk: {assigneeLabel(t)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn("text-xs text-muted-foreground", isOverdue(t.deadline, t.status) && "font-medium text-destructive")}>
              {formatDate(t.deadline)}
            </span>
            <StatusBadge status={t.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
