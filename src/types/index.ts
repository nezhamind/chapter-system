export type RoleName =
  | "super_admin"
  | "president"
  | "sekjen"
  | "bendahara"
  | "kepala_divisi"
  | "anggota";

export type TaskStatus = "todo" | "in_progress" | "done";

export interface Profile {
  id: string;
  name: string;
  email: string;
  role: RoleName;
  divisionId: number | null;
  divisionName: string | null;
}

export interface TaskRow {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  deadline: string | null;
  attachment_url: string | null;
  created_at: string;
  assigned_to_user_id: string | null;
  assigned_to_division_id: number | null;
  assignee: { name: string; division_id: number | null } | null;
  creator: { name: string } | null;
  division: { division_name: string } | null;
}

export const statusLabels: Record<TaskStatus, string> = {
  todo: "To-Do",
  in_progress: "In Progress",
  done: "Done",
};

export const STATUSES: TaskStatus[] = ["todo", "in_progress", "done"];
