export function formatDate(inputDate: string): string {
  const date = new Date(inputDate);

  return date
    .toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "2-digit",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .replace(",", " •");
}
