/**
 * Format a Date as YYYY-MM-DD using LOCAL time (not UTC).
 * Using toISOString() would shift dates for users west of UTC.
 */
export function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Return the Monday of the week containing `date`.
 */
export function getMonday(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sunday
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/**
 * Return an array of 7 Date objects (Mon–Sun) for the week
 * that is `weekOffset` weeks away from the current week.
 */
export function getWeekDays(weekOffset = 0) {
  const monday = getMonday(new Date());
  monday.setDate(monday.getDate() + weekOffset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

export function isToday(date) {
  return formatDate(date) === formatDate(new Date());
}

export function isFuture(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date = new Date(date);
  date.setHours(0, 0, 0, 0);
  return date > today;
}

/** Short weekday label: "Mon", "Tue", … */
export function shortDay(date) {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

/** Short date label: "24", "25", … */
export function dayNum(date) {
  return date.getDate();
}

/** "May 2026" style label for a week */
export function weekLabel(days) {
  const first = days[0];
  const last = days[6];
  const opts = { month: 'short', year: 'numeric' };
  if (first.getMonth() === last.getMonth()) {
    return `${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  }
  return `${first.toLocaleDateString('en-US', opts)} – ${last.toLocaleDateString('en-US', opts)}`;
}
