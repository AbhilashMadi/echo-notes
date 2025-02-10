export function getExpirationTime(exp: string, unit: "ms" | "s" = "ms"): number {
  if (!exp || typeof exp !== "string") {
    throw new Error("Expiration time must be a non-empty string.");
  }

  exp = exp.trim().toLowerCase();
  const timeUnit = exp.slice(-1); // Get last character (unit)
  const value = Number.parseInt(exp.slice(0, -1), 10); // Extract numeric value

  if (Number.isNaN(value) || value <= 0) {
    throw new Error(`Invalid expiration time format: "${exp}". Expected format: "5m", "2h", "1d", etc.`);
  }

  // Convert to milliseconds
  let millis;
  switch (timeUnit) {
    case "s":
      millis = value * 1000;
      break; // Seconds → Milliseconds
    case "m":
      millis = value * 60 * 1000;
      break; // Minutes → Milliseconds
    case "h":
      millis = value * 60 * 60 * 1000;
      break; // Hours → Milliseconds
    case "d":
      millis = value * 24 * 60 * 60 * 1000;
      break; // Days → Milliseconds
    default:
      throw new Error(`Unsupported time unit: "${timeUnit}". Use "s", "m", "h", or "d".`);
  }

  // Enforce maximum allowed time (400 days)
  // 400 days in milliseconds
  millis = Math.min(millis, 400 * 24 * 60 * 60 * 1000);

  // Convert to desired unit (ms or s)
  return unit === "s" ? Math.floor(millis / 1000) : millis;
}
