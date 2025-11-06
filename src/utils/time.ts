export function formatMinutesToHoursAndMinutes(totalMinutes: number): string {
  if (!totalMinutes || totalMinutes <= 0) return '0min';

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);

  return parts.join(' ') || '0min';
}
