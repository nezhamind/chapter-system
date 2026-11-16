"use client";

import { useActionState } from "react";
import { uploadProof, type ActionState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ProofForm({ taskId }: { taskId: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(uploadProof, {});

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="taskId" value={taskId} />
      <div className="space-y-2">
        <Label htmlFor="file">File bukti (foto, PDF, dll.)</Label>
        <Input id="file" name="file" type="file" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="note">Catatan (opsional)</Label>
        <Textarea id="note" name="note" rows={2} />
      </div>
      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && <p className="text-sm text-emerald-700">{state.success}</p>}
      <Button type="submit" disabled={pending}>
        {pending ? "Mengunggah..." : "Unggah bukti"}
      </Button>
    </form>
  );
}
