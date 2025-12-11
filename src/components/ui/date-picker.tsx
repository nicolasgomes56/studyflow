import { dateToDateValue, dateValueToDate } from '@/lib/date-utils';
import { cn } from '@/lib/utils';
import type { DateValue } from '@internationalized/date';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { Button } from './button';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

interface DatePickerProps {
  date?: Date;
  onDateChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

interface DatePickerWithDateValueProps {
  value?: DateValue | null;
  onChange?: (value: DateValue | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export function DatePicker({
  date,
  onDateChange,
  placeholder = 'Selecione uma data',
  disabled = false,
  className,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn(
            'w-full justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, 'PPP', { locale: ptBR }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar mode='single' selected={date} onSelect={onDateChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

/**
 * DatePicker que aceita e retorna DateValue diretamente
 */
export function DatePickerWithDateValue({
  value,
  onChange,
  placeholder = 'Selecione uma data',
  disabled = false,
  className,
}: DatePickerWithDateValueProps) {
  const date = dateValueToDate(value);

  const handleDateChange = (newDate: Date | undefined) => {
    const dateValue = dateToDateValue(newDate);
    onChange?.(dateValue);
  };

  return (
    <DatePicker
      date={date}
      onDateChange={handleDateChange}
      placeholder={placeholder}
      disabled={disabled}
      className={className}
    />
  );
}
