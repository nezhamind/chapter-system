"use client";

import { useActionState } from "react";
import { updateTaskStatus, type ActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { STATUSES, statusLabels, type TaskStatus } from "@/types";

export function StatusButtons({ taskId, current }: { taskId: string; current: TaskStatus }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(updateTaskStatus, {});

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="taskId" value={taskId} />
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            type="submit"
            name="status"
            value={s}
            size="sm"
            variant={s === current ? "default" : "outline"}
            disabled={pending}
          >
            {statusLabels[s]}
          </Button>
        ))}
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
    </form>
  );
}
