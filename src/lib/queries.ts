export const TASK_SELECT =
  "id,title,description,status,deadline,attachment_url,created_at,assigned_to_user_id,assigned_to_division_id," +
  "assignee:profiles!tasks_assigned_to_user_id_fkey(name,division_id)," +
  "creator:profiles!tasks_created_by_fkey(name)," +
  "division:divisions(division_name)";
