import { hoursToMilliseconds, intervalToDuration, minutesToMilliseconds } from 'date-fns';

export function formatDuration(hours: number): string {
  if (!hours || hours <= 0) return '0min';

  const totalMilliseconds = hoursToMilliseconds(hours);
  const duration = intervalToDuration({ start: 0, end: totalMilliseconds });

  const parts: string[] = [];

  if (duration.hours && duration.hours > 0) parts.push(`${duration.hours}h`);
  if (duration.minutes && duration.minutes > 0) parts.push(`${duration.minutes}min`);

  return parts.join(' ') || '0min';
}

export function hoursToMinutes(hours: number): { hours: number; minutes: number } {
  if (!hours || hours <= 0) return { hours: 0, minutes: 0 };

  const totalMilliseconds = hoursToMilliseconds(hours);
  const duration = intervalToDuration({ start: 0, end: totalMilliseconds });

  return {
    hours: duration.hours ?? 0,
    minutes: duration.minutes ?? 0,
  };
}

export function minutesToHours(hours: number, minutes: number): number {
  const totalMilliseconds = hoursToMilliseconds(hours) + minutesToMilliseconds(minutes);
  return totalMilliseconds / hoursToMilliseconds(1);
}
