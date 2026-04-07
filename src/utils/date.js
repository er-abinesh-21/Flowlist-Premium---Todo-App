import { format, isToday, isTomorrow, isYesterday } from "date-fns";

export function toDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function toDateTimeLocalValue(value) {
  const date = toDate(value);
  if (!date) {
    return "";
  }

  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
}

export function formatDueDate(value) {
  const date = toDate(value);
  if (!date) {
    return "No due date";
  }

  if (isToday(date)) {
    return `Today, ${format(date, "p")}`;
  }

  if (isTomorrow(date)) {
    return `Tomorrow, ${format(date, "p")}`;
  }

  if (isYesterday(date)) {
    return `Yesterday, ${format(date, "p")}`;
  }

  return format(date, "MMM d, yyyy p");
}

export function isOverdue(value) {
  const date = toDate(value);
  if (!date) {
    return false;
  }

  return date.getTime() < Date.now();
}

export function toIsoDate(value) {
  const date = toDate(value);
  if (!date) {
    return "";
  }

  return format(date, "yyyy-MM-dd");
}
