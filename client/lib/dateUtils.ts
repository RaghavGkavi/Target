/**
 * UTC Date utility functions for consistent date handling across devices and timezones
 */

/**
 * Get the current date in UTC with time set to midnight
 */
export function getUTCDateOnly(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

/**
 * Get a date in UTC with time set to midnight
 */
export function toUTCDateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Check if two dates are the same UTC day
 */
export function isSameUTCDay(date1: Date, date2: Date): boolean {
  const utc1 = toUTCDateOnly(date1);
  const utc2 = toUTCDateOnly(date2);
  return utc1.getTime() === utc2.getTime();
}

/**
 * Get the difference in days between two dates in UTC
 */
export function getDayDifferenceUTC(date1: Date, date2: Date): number {
  const utc1 = toUTCDateOnly(date1);
  const utc2 = toUTCDateOnly(date2);
  return Math.floor((utc1.getTime() - utc2.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Check if a date is consecutive to another date (next day in UTC)
 */
export function isConsecutiveUTCDay(currentDate: Date, previousDate: Date): boolean {
  return getDayDifferenceUTC(currentDate, previousDate) === 1;
}

/**
 * Get the UTC date string in format YYYY-MM-DD
 */
export function getUTCDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Get the current UTC timestamp for database operations
 */
export function getUTCTimestamp(): Date {
  return new Date();
}
