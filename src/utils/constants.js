export const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

export const SORT_OPTIONS = [
  { label: "Newest", value: "created-desc" },
  { label: "Oldest", value: "created-asc" },
  { label: "Due date", value: "due-asc" },
  { label: "Priority", value: "priority-desc" },
];

export const STATUS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Completed", value: "completed" },
];

export const THEME_STORAGE_KEY = "premium-todo-theme";

export const FIRESTORE_COLLECTIONS = {
  users: "users",
  todos: "todos",
};

export const DEFAULT_TODO_FORM = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  tags: "",
};

export const PRIORITY_WEIGHT = {
  low: 1,
  medium: 2,
  high: 3,
};

export const STREAK_WINDOW_DAYS = 90;
