/**
 * Interface que representa um valor de data semelhante ao DateValue do @internationalized/date
 */
export interface DateValue {
  year: number;
  month: number;
  day: number;
}

/**
 * Converte DateValue para Date (timezone local, sem horas/minutos/segundos)
 */
export function dateValueToDate(dateValue: DateValue | null | undefined): Date | undefined {
  if (!dateValue) return undefined;
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day, 0, 0, 0, 0);
}

/**
 * Converte Date para DateValue (usa apenas a parte da data, ignora timezone)
 */
export function dateToDateValue(date: Date | null | undefined): DateValue | null {
  if (!date) return null;

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return { year, month, day };
}
