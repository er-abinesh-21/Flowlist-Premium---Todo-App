import { format, subDays } from "date-fns";

import { STREAK_WINDOW_DAYS } from "./constants";
import { toDate } from "./date";

export function calculateCompletionStats(todos) {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;
  const open = total - completed;
  const completionRate = total ? Math.round((completed / total) * 100) : 0;

  return {
    total,
    completed,
    open,
    completionRate,
  };
}

export function calculateTodayProgress(todos) {
  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todaysTasks = todos.filter(
    (todo) => format(toDate(todo.createdAt) ?? new Date(), "yyyy-MM-dd") === todayKey,
  );

  const doneToday = todaysTasks.filter((todo) => todo.completed).length;
  const totalToday = todaysTasks.length;

  return {
    doneToday,
    totalToday,
    progress: totalToday ? Math.round((doneToday / totalToday) * 100) : 0,
  };
}

export function calculateStreak(todos) {
  const completionMap = new Set(
    todos
      .filter((todo) => todo.completed && todo.completedAt)
      .map((todo) => format(toDate(todo.completedAt), "yyyy-MM-dd")),
  );

  let currentStreak = 0;

  for (let i = 0; i < STREAK_WINDOW_DAYS; i += 1) {
    const dayKey = format(subDays(new Date(), i), "yyyy-MM-dd");
    if (completionMap.has(dayKey)) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return currentStreak;
}
