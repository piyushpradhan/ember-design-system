import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ReactNode,
} from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '../../primitives/Popover'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from '../Command'
import styles from './Combobox.module.css'

export interface ComboboxOption {
  label: ReactNode
  value: string
  disabled?: boolean
}

export interface ComboboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** The selectable options. */
  options: ComboboxOption[]
  /** Controlled selected value. */
  value?: string
  /** Uncontrolled initial selected value. */
  defaultValue?: string
  /** Notified when the selection changes. */
  onChange?: (value: string) => void
  /** Trigger text shown when nothing is selected. */
  placeholder?: string
  /** Placeholder for the search input inside the panel. */
  searchPlaceholder?: string
  /** Message shown when no option matches the search. Default 'No results.' */
  emptyText?: ReactNode
  disabled?: boolean
  /** Class applied to the trigger button. */
  triggerClassName?: string
}

/**
 * A searchable single-select autocomplete. Composes the design-system Popover
 * (trigger button + matched-width panel) with the Command listbox for filtering
 * and keyboard navigation.
 */
export const Combobox = forwardRef<HTMLButtonElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onChange,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    emptyText = 'No results.',
    disabled = false,
    triggerClassName,
    className,
    ...rest
  },
  ref
) {
  const listboxId = useId()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onChange as ((value: string | undefined) => void) | undefined,
  })
  const inputRef = useRef<HTMLInputElement | null>(null)

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selected),
    [options, selected]
  )

  // Build a value -> searchable text map so users can filter by the visible
  // label even when it is not a plain string passed as item children.
  const searchText = useMemo(() => {
    const map = new Map<string, string>()
    for (const o of options) {
      map.set(o.value, (typeof o.label === 'string' ? o.label : o.value).toLowerCase())
    }
    return map
  }, [options])

  const filter = useMemo(
    () => (itemValue: string, search: string) => {
      if (!search) return true
      const haystack = searchText.get(itemValue) ?? itemValue.toLowerCase()
      return haystack.includes(search.toLowerCase())
    },
    [searchText]
  )

  // Move focus into the search field when the panel opens (guarded for jsdom).
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => inputRef.current?.focus?.())
      return () => cancelAnimationFrame(id)
    }
  }, [open])

  const handleSelect = (next: string) => {
    setSelected(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <button
          ref={ref}
          type="button"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          data-placeholder={selectedOption ? undefined : ''}
          className={cn(styles.trigger, triggerClassName, className)}
          {...rest}
        >
          <span className={styles.triggerLabel}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronsUpDown size={16} className={styles.triggerIcon} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        matchWidth
        placement="bottom-start"
        offset={6}
        role="presentation"
        className={styles.panel}
      >
        <Command onSelect={handleSelect} filter={filter} className={styles.command}>
          <CommandInput ref={inputRef} placeholder={searchPlaceholder} />
          <CommandList id={listboxId}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                onSelect={handleSelect}
              >
                <Check
                  size={16}
                  className={cn(
                    styles.check,
                    option.value === selected && styles.checkVisible
                  )}
                  aria-hidden
                />
                <span className={styles.optionLabel}>{option.label}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
})
