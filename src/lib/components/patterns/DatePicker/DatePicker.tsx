import { forwardRef, useCallback, type HTMLAttributes } from 'react'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { Button } from '../../primitives/Button'
import { Popover, PopoverTrigger, PopoverContent } from '../../primitives/Popover'
import { Calendar, type CalendarSelected } from '../Calendar'
import styles from './DatePicker.module.css'

export interface DatePickerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  /** Formats the selected date for the trigger label. */
  format?: (date: Date) => string
  disabled?: boolean
  /** Earliest selectable date (inclusive). */
  fromDate?: Date
  /** Latest selectable date (inclusive). */
  toDate?: Date
}

function defaultFormat(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(function DatePicker(
  {
    value,
    defaultValue,
    onChange,
    placeholder = 'Pick a date',
    format = defaultFormat,
    disabled = false,
    fromDate,
    toDate,
    className,
    ...rest
  },
  ref
) {
  const [date, setDate] = useControllableState<Date | undefined>({
    value,
    defaultValue,
    onChange,
  })
  const [open, setOpen] = useControllableState<boolean>({ defaultValue: false })

  const handleSelect = useCallback(
    (next: CalendarSelected) => {
      setDate(next instanceof Date ? next : undefined)
      setOpen(false)
    },
    [setDate, setOpen]
  )

  return (
    <div ref={ref} className={cn(styles.root, className)} {...rest}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            variant="secondary"
            disabled={disabled}
            leadingIcon={<CalendarIcon size={16} aria-hidden />}
            className={cn(styles.trigger, !date && styles.placeholder)}
          >
            {date ? format(date) : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent placement="bottom-start" className={styles.content}>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            defaultMonth={date}
            fromDate={fromDate}
            toDate={toDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
})
