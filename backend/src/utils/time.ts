export function getExpirationTime(exp: string): number {
  const unit = exp.slice(-1); // Get last character (unit)
  const value = parseInt(exp.slice(0, -1), 10); // Get numeric value

  if (isNaN(value)) throw new Error(`Invalid expiration time format: ${exp}`);

  // Convert to milliseconds for cookies
  switch (unit) {
    case "s": return value * 1000;       // Seconds → Milliseconds
    case "m": return value * 60 * 1000;  // Minutes → Milliseconds
    case "h": return value * 60 * 60 * 1000; // Hours → Milliseconds
    case "d": return value * 24 * 60 * 60 * 1000; // Days → Milliseconds
    default: throw new Error(`Unsupported time unit: ${unit}`);
  }
};
