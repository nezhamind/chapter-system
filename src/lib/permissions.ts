import type { RoleName } from "@/types";

export const canCreateTasks = (role: RoleName) => role === "sekjen" || role === "super_admin";

export const canViewAllTasks = (role: RoleName) =>
  role === "sekjen" || role === "president" || role === "super_admin";
