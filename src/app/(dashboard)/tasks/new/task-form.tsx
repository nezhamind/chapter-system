"use client";

import { useActionState, useState } from "react";
import { createTask, type TaskFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

interface Props {
  divisions: { id: number; division_name: string }[];
  members: { id: string; name: string; division_name: string | null }[];
}

export function TaskForm({ divisions, members }: Props) {
  const [state, action, pending] = useActionState<TaskFormState, FormData>(createTask, {});
  const [assignType, setAssignType] = useState<"division" | "user">("division");

  return (
    <form action={action} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Judul tugas</Label>
        <Input id="title" name="title" placeholder="Contoh: Desain poster Instagram" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" name="description" rows={5} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Input id="deadline" name="deadline" type="datetime-local" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">Lampiran (opsional)</Label>
        <Input id="attachment" name="attachment" type="file" />
      </div>

      <div className="space-y-3">
        <Label>Tugaskan ke</Label>
        <input type="hidden" name="assignType" value={assignType} />
        <div className="flex gap-2">
          <Button type="button" variant={assignType === "division" ? "default" : "outline"} onClick={() => setAssignType("division")}>
            Divisi
          </Button>
          <Button type="button" variant={assignType === "user" ? "default" : "outline"} onClick={() => setAssignType("user")}>
            Anggota tertentu
          </Button>
        </div>

        {assignType === "division" ? (
          <Select name="divisionId" defaultValue="">
            <option value="" disabled>Pilih divisi</option>
            {divisions.map((d) => (
              <option key={d.id} value={d.id}>{d.division_name}</option>
            ))}
          </Select>
        ) : (
          <Select name="userId" defaultValue="">
            <option value="" disabled>Pilih anggota</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}{m.division_name ? ` (${m.division_name})` : ""}
              </option>
            ))}
          </Select>
        )}
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Menerbitkan..." : "Terbitkan tugas"}
      </Button>
    </form>
  );
}
