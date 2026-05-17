import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Select.module.css'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectOption {
  label: ReactNode
  value: string
  disabled?: boolean
  description?: ReactNode
  icon?: ReactNode
}

export interface SelectProps {
  options: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  selectSize?: SelectSize
  invalid?: boolean
  disabled?: boolean
  className?: string
  name?: string
  id?: string
  'aria-label'?: string
  'aria-labelledby'?: string
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    selectSize = 'md',
    invalid,
    disabled,
    className,
    name,
    id,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
  },
  ref
) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue)
  const currentValue = isControlled ? value : internalValue

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)

  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const listRef = useRef<HTMLUListElement | null>(null)
  const optionRefs = useRef<Array<HTMLLIElement | null>>([])
  const reactId = useId()
  const listboxId = id ? `${id}-listbox` : `select-${reactId}-listbox`

  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement, [])

  const selectedIndex = useMemo(
    () => options.findIndex((o) => o.value === currentValue),
    [options, currentValue]
  )
  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined

  const commitValue = useCallback(
    (next: string) => {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  const openMenu = useCallback(() => {
    if (disabled) return
    setOpen(true)
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0)
  }, [disabled, selectedIndex])

  const closeMenu = useCallback(() => {
    setOpen(false)
    setActiveIndex(-1)
    buttonRef.current?.focus()
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        buttonRef.current?.contains(target) ||
        listRef.current?.contains(target)
      )
        return
      setOpen(false)
      setActiveIndex(-1)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  // Scroll active option into view
  useEffect(() => {
    if (!open || activeIndex < 0) return
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  const moveActive = useCallback(
    (delta: number) => {
      const n = options.length
      if (n === 0) return
      let next = activeIndex
      for (let i = 0; i < n; i++) {
        next = (next + delta + n) % n
        if (!options[next].disabled) {
          setActiveIndex(next)
          return
        }
      }
    },
    [activeIndex, options]
  )

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (disabled) return
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) {
        e.preventDefault()
        openMenu()
      }
      return
    }
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        e.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        e.preventDefault()
        setActiveIndex(options.findIndex((o) => !o.disabled))
        break
      case 'End':
        e.preventDefault()
        for (let i = options.length - 1; i >= 0; i--) {
          if (!options[i].disabled) {
            setActiveIndex(i)
            break
          }
        }
        break
      case 'Enter':
      case ' ': {
        e.preventDefault()
        const opt = options[activeIndex]
        if (opt && !opt.disabled) {
          commitValue(opt.value)
          closeMenu()
        }
        break
      }
      case 'Escape':
      case 'Tab':
        e.preventDefault()
        closeMenu()
        break
    }
  }

  return (
    <div
      className={cn(
        styles.wrap,
        styles[`size-${selectSize}`],
        invalid && styles.invalid,
        disabled && styles.disabled,
        open && styles.open,
        className
      )}
    >
      {name && (
        <input type="hidden" name={name} value={currentValue ?? ''} />
      )}
      <button
        ref={buttonRef}
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={invalid || undefined}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        disabled={disabled}
        className={styles.trigger}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
      >
        <span className={cn(styles.value, !selectedOption && styles.placeholder)}>
          {selectedOption?.icon && <span className={styles.valueIcon}>{selectedOption.icon}</span>}
          <span className={styles.valueLabel}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDown size={14} className={styles.chevron} aria-hidden />
      </button>

      <ul
        ref={listRef}
        id={listboxId}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={
          open && activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
        }
        className={styles.menu}
        onKeyDown={handleKeyDown}
      >
        {options.map((opt, i) => {
          const isSelected = opt.value === currentValue
          const isActive = i === activeIndex
          return (
            <li
              key={opt.value}
              id={`${listboxId}-opt-${i}`}
              ref={(el) => {
                optionRefs.current[i] = el
              }}
              role="option"
              aria-selected={isSelected}
              aria-disabled={opt.disabled || undefined}
              className={cn(
                styles.option,
                isActive && styles.active,
                isSelected && styles.selected,
                opt.disabled && styles.optionDisabled
              )}
              onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
              onClick={() => {
                if (opt.disabled) return
                commitValue(opt.value)
                closeMenu()
              }}
            >
              {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
              <span className={styles.optionLabel}>
                <span>{opt.label}</span>
                {opt.description && (
                  <span className={styles.optionDescription}>{opt.description}</span>
                )}
              </span>
              <span className={styles.check} aria-hidden>
                <Check size={14} strokeWidth={2.5} />
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
})
