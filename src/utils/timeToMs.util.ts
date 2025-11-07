/**
 * Converts time string to milliseconds
 * Supports formats: 's' (seconds), 'm' (minutes), 'h' (hours), 'd' (days)
 * Examples: '30m', '1h', '7d', '24h', '3600s'
 *
 * @param timeString - Time string in format like '7d', '30m', '1h', etc.
 * @returns Time in milliseconds
 * @throws Error if format is invalid
 */
export function timeToMs(timeString: string): number {
  const trimmed = timeString.trim();

  if (!trimmed) {
    throw new Error('Time string cannot be empty');
  }

  // Match pattern: number followed by unit (s, m, h, d)
  const match = trimmed.match(/^(\d+)([smhd])$/i);

  if (!match) {
    throw new Error(
      `Invalid time format: "${timeString}". Expected format: number followed by unit (s, m, h, d). Example: "7d", "30m"`,
    );
  }

  const value = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();

  const multipliers: Record<string, number> = {
    s: 1000, // seconds to milliseconds
    m: 60 * 1000, // minutes to milliseconds
    h: 60 * 60 * 1000, // hours to milliseconds
    d: 24 * 60 * 60 * 1000, // days to milliseconds
  };

  return value * multipliers[unit];
}
