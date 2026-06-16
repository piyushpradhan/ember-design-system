import {
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { IconButton } from '../../primitives/IconButton'
import styles from './Calendar.module.css'

export type CalendarMode = 'single' | 'range' | 'multiple'

export interface DateRange {
  from?: Date
  to?: Date
}

export type CalendarSelected = Date | DateRange | Date[] | undefined

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'defaultValue'> {
  mode?: CalendarMode
  selected?: CalendarSelected
  onSelect?: (value: CalendarSelected) => void
  month?: Date
  defaultMonth?: Date
  onMonthChange?: (month: Date) => void
  /** Earliest selectable date (inclusive). */
  fromDate?: Date
  /** Latest selectable date (inclusive). */
  toDate?: Date
  disabled?: (date: Date) => boolean
  /** 0 = Sunday … 6 = Saturday. Default 1 (Monday). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
  showOutsideDays?: boolean
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function addDays(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

function addMonths(d: Date, n: number): Date {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}

function fullLabel(d: Date): string {
  return `${WEEKDAY_LONG[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/** Build the 6×7 grid of dates for the visible month, padded to whole weeks. */
function buildGrid(month: Date, weekStartsOn: number): Date[][] {
  const firstOfMonth = new Date(month.getFullYear(), month.getMonth(), 1)
  const offset = (firstOfMonth.getDay() - weekStartsOn + 7) % 7
  const gridStart = addDays(firstOfMonth, -offset)
  const weeks: Date[][] = []
  let cursor = gridStart
  for (let w = 0; w < 6; w++) {
    const week: Date[] = []
    for (let d = 0; d < 7; d++) {
      week.push(cursor)
      cursor = addDays(cursor, 1)
    }
    weeks.push(week)
  }
  return weeks
}

function orderedWeekdays(weekStartsOn: number): number[] {
  return Array.from({ length: 7 }, (_, i) => (weekStartsOn + i) % 7)
}

function asArray(selected: CalendarSelected): Date[] {
  if (!selected) return []
  if (selected instanceof Date) return [selected]
  if (Array.isArray(selected)) return selected
  const r: Date[] = []
  if (selected.from) r.push(selected.from)
  if (selected.to) r.push(selected.to)
  return r
}

function isSelectedDay(date: Date, mode: CalendarMode, selected: CalendarSelected): boolean {
  if (mode === 'single') {
    return selected instanceof Date && isSameDay(date, selected)
  }
  if (mode === 'multiple') {
    return Array.isArray(selected) && selected.some((d) => isSameDay(date, d))
  }
  // range
  const range = (selected ?? {}) as DateRange
  return (
    (range.from != null && isSameDay(date, range.from)) ||
    (range.to != null && isSameDay(date, range.to))
  )
}

function isInRange(date: Date, mode: CalendarMode, selected: CalendarSelected): boolean {
  if (mode !== 'range') return false
  const range = (selected ?? {}) as DateRange
  if (!range.from || !range.to) return false
  const t = startOfDay(date).getTime()
  return t > startOfDay(range.from).getTime() && t < startOfDay(range.to).getTime()
}

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  {
    mode = 'single',
    selected,
    onSelect,
    month,
    defaultMonth,
    onMonthChange,
    fromDate,
    toDate,
    disabled,
    weekStartsOn = 1,
    showOutsideDays = true,
    className,
    ...rest
  },
  ref
) {
  const initialMonth = useMemo(() => {
    const base = defaultMonth ?? firstSelected(selected) ?? new Date()
    return new Date(base.getFullYear(), base.getMonth(), 1)
  }, [defaultMonth, selected])

  const [visibleMonth, setVisibleMonth] = useControllableState<Date>({
    value: month,
    defaultValue: initialMonth,
    onChange: onMonthChange,
  })

  // The day currently reachable by keyboard (roving tabindex).
  const [focusedDate, setFocusedDate] = useState<Date>(() => {
    const sel = firstSelected(selected)
    if (sel && isSameMonth(sel, visibleMonth)) return startOfDay(sel)
    const today = startOfDay(new Date())
    if (isSameMonth(today, visibleMonth)) return today
    return new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1)
  })

  const gridRef = useRef<HTMLDivElement>(null)
  const today = useMemo(() => startOfDay(new Date()), [])

  const isOutOfBounds = useCallback(
    (date: Date): boolean => {
      if (fromDate && startOfDay(date).getTime() < startOfDay(fromDate).getTime()) return true
      if (toDate && startOfDay(date).getTime() > startOfDay(toDate).getTime()) return true
      return false
    },
    [fromDate, toDate]
  )

  const isDisabledDay = useCallback(
    (date: Date): boolean => isOutOfBounds(date) || (disabled?.(date) ?? false),
    [isOutOfBounds, disabled]
  )

  const goToMonth = useCallback(
    (next: Date) => {
      setVisibleMonth(new Date(next.getFullYear(), next.getMonth(), 1))
    },
    [setVisibleMonth]
  )

  const handleSelect = useCallback(
    (date: Date) => {
      const day = startOfDay(date)
      if (mode === 'single') {
        onSelect?.(day)
      } else if (mode === 'multiple') {
        const current = Array.isArray(selected) ? selected : []
        const exists = current.some((d) => isSameDay(d, day))
        const next = exists ? current.filter((d) => !isSameDay(d, day)) : [...current, day]
        onSelect?.(next)
      } else {
        const range = (selected ?? {}) as DateRange
        if (!range.from || (range.from && range.to)) {
          onSelect?.({ from: day, to: undefined })
        } else if (day.getTime() < startOfDay(range.from).getTime()) {
          onSelect?.({ from: day, to: range.from })
        } else {
          onSelect?.({ from: range.from, to: day })
        }
      }
    },
    [mode, selected, onSelect]
  )

  const moveFocus = useCallback(
    (next: Date) => {
      const day = startOfDay(next)
      setFocusedDate(day)
      if (!isSameMonth(day, visibleMonth)) {
        goToMonth(day)
      }
      // Focus the matching cell after render.
      requestAnimationFrame(() => {
        const el = gridRef.current?.querySelector<HTMLButtonElement>(
          `[data-day="${day.getFullYear()}-${day.getMonth()}-${day.getDate()}"]`
        )
        el?.focus()
      })
    },
    [visibleMonth, goToMonth]
  )

  const onGridKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      let handled = true
      switch (e.key) {
        case 'ArrowLeft':
          moveFocus(addDays(focusedDate, -1))
          break
        case 'ArrowRight':
          moveFocus(addDays(focusedDate, 1))
          break
        case 'ArrowUp':
          moveFocus(addDays(focusedDate, -7))
          break
        case 'ArrowDown':
          moveFocus(addDays(focusedDate, 7))
          break
        case 'Home':
          moveFocus(addDays(focusedDate, -((focusedDate.getDay() - weekStartsOn + 7) % 7)))
          break
        case 'End':
          moveFocus(addDays(focusedDate, 6 - ((focusedDate.getDay() - weekStartsOn + 7) % 7)))
          break
        case 'PageUp':
          moveFocus(addMonths(focusedDate, -1))
          break
        case 'PageDown':
          moveFocus(addMonths(focusedDate, 1))
          break
        case 'Enter':
        case ' ':
          if (!isDisabledDay(focusedDate)) handleSelect(focusedDate)
          break
        default:
          handled = false
      }
      if (handled) e.preventDefault()
    },
    [focusedDate, moveFocus, weekStartsOn, isDisabledDay, handleSelect]
  )

  const weeks = useMemo(() => buildGrid(visibleMonth, weekStartsOn), [visibleMonth, weekStartsOn])
  const weekdays = useMemo(() => orderedWeekdays(weekStartsOn), [weekStartsOn])

  const prevDisabled = fromDate
    ? isSameMonth(visibleMonth, fromDate) ||
      visibleMonth.getTime() <= new Date(fromDate.getFullYear(), fromDate.getMonth(), 1).getTime()
    : false
  const nextDisabled = toDate
    ? isSameMonth(visibleMonth, toDate) ||
      visibleMonth.getTime() >= new Date(toDate.getFullYear(), toDate.getMonth(), 1).getTime()
    : false

  return (
    <div ref={ref} className={cn(styles.root, className)} {...rest}>
      <div className={styles.caption}>
        <IconButton
          aria-label="Previous month"
          variant="ghost"
          size="sm"
          disabled={prevDisabled}
          icon={<ChevronLeft size={16} />}
          onClick={() => goToMonth(addMonths(visibleMonth, -1))}
        />
        <div className={styles.captionLabel} aria-live="polite">
          {MONTH_NAMES[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
        </div>
        <IconButton
          aria-label="Next month"
          variant="ghost"
          size="sm"
          disabled={nextDisabled}
          icon={<ChevronRight size={16} />}
          onClick={() => goToMonth(addMonths(visibleMonth, 1))}
        />
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={`${MONTH_NAMES[visibleMonth.getMonth()]} ${visibleMonth.getFullYear()}`}
        className={styles.grid}
        onKeyDown={onGridKeyDown}
      >
        <div role="row" className={styles.weekdays}>
          {weekdays.map((wd) => (
            <div
              key={wd}
              role="columnheader"
              aria-label={WEEKDAY_LONG[wd]}
              className={styles.weekday}
            >
              {WEEKDAY_SHORT[wd]}
            </div>
          ))}
        </div>

        {weeks.map((week, wi) => (
          <div role="row" key={wi} className={styles.week}>
            {week.map((date) => {
              const outside = !isSameMonth(date, visibleMonth)
              if (outside && !showOutsideDays) {
                return (
                  <div
                    key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                    role="gridcell"
                    className={styles.empty}
                    aria-hidden
                  />
                )
              }
              const disabledDay = isDisabledDay(date)
              const selectedDay = isSelectedDay(date, mode, selected)
              const inRange = isInRange(date, mode, selected)
              const isToday = isSameDay(date, today)
              const isFocusTarget = isSameDay(date, focusedDate)
              return (
                <button
                  key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  type="button"
                  role="gridcell"
                  data-day={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
                  aria-label={fullLabel(date)}
                  aria-selected={selectedDay}
                  aria-disabled={disabledDay || undefined}
                  aria-current={isToday ? 'date' : undefined}
                  tabIndex={isFocusTarget ? 0 : -1}
                  disabled={disabledDay}
                  className={cn(
                    styles.day,
                    outside && styles.outside,
                    selectedDay && styles.selected,
                    inRange && styles.inRange,
                    isToday && styles.today
                  )}
                  onClick={() => {
                    setFocusedDate(startOfDay(date))
                    handleSelect(date)
                  }}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
})

function firstSelected(selected: CalendarSelected): Date | undefined {
  const arr = asArray(selected)
  return arr[0]
}
