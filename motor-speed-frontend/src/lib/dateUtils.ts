// Utility to safely parse dates and avoid 'Invalid Date' errors
export function safeDate(input: string | number | Date): Date | null {
  const d = new Date(input);
  return isNaN(d.getTime()) ? null : d;
}
