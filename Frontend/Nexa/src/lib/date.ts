const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  );
}

function formatTime(date: Date) {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours % 12 || 12}:${minutes} ${hours >= 12 ? 'PM' : 'AM'}`;
}

/** "Today, 12:42 PM" / "Yesterday, 8:05 AM" / "12 Oct, 6:30 PM" */
export function formatTripWhen(iso: string, now = new Date()) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const day = sameDay(date, now)
    ? 'Today'
    : sameDay(date, yesterday)
      ? 'Yesterday'
      : `${date.getDate()} ${MONTHS[date.getMonth()]}`;

  return `${day}, ${formatTime(date)}`;
}
