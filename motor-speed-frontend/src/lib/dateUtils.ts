// Utility to safely parse dates and avoid 'Invalid Date' errors
export function safeDate(input: string | number | Date): Date | null {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}

// Timezone-aware date utilities for consistent handling
export function formatTimestamp(
  timestamp: string | Date,
  options?: {
    includeTime?: boolean;
    includeSeconds?: boolean;
    useLocalTime?: boolean;
  }
): string {
  const {
    includeTime = true,
    includeSeconds = false,
    useLocalTime = true,
  } = options || {};

  const date = safeDate(timestamp);
  if (!date) return "Invalid Date";

  if (useLocalTime) {
    // Display in user's local timezone
    if (includeTime) {
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        ...(includeSeconds && { second: "2-digit" }),
      });
    } else {
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } else {
    // Display in UTC
    if (includeTime) {
      return date
        .toISOString()
        .replace("T", " ")
        .replace(/\.\d{3}Z$/, " UTC");
    } else {
      return date.toISOString().split("T")[0];
    }
  }
}

// Get local time components for consistent grouping
export function getLocalDateComponents(timestamp: string | Date): {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  const date = safeDate(timestamp);
  if (!date) return null;

  return {
    year: date.getFullYear(),
    month: date.getMonth(),
    date: date.getDate(),
    hours: date.getHours(),
    minutes: date.getMinutes(),
    seconds: date.getSeconds(),
  };
}

// Get UTC time components for consistent calculations
export function getUTCDateComponents(timestamp: string | Date): {
  year: number;
  month: number;
  date: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null {
  const date = safeDate(timestamp);
  if (!date) return null;

  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth(),
    date: date.getUTCDate(),
    hours: date.getUTCHours(),
    minutes: date.getUTCMinutes(),
    seconds: date.getUTCSeconds(),
  };
}
