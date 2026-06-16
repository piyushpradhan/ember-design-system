import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { Modal, type ModalProps } from '../Modal'
import styles from './Command.module.css'

/**
 * Matcher signature for a Command's `filter` prop. Receives the item's text and
 * the current search; return a truthy value (or positive number) to keep the
 * item visible.
 */
export type CommandFilter = (value: string, search: string) => number | boolean

/** Default substring (case-insensitive) matcher over the item value/text. */
const defaultFilter: CommandFilter = (value, search) => {
  if (!search) return true
  return value.toLowerCase().includes(search.toLowerCase())
}

interface RegisteredItem {
  id: string
  value: string
  /** Plain-text representation used for filtering. */
  text: string
  disabled: boolean
}

interface CommandContextValue {
  search: string
  setSearch: (next: string) => void
  activeValue: string | undefined
  setActiveValue: (next: string | undefined) => void
  filter: CommandFilter
  /** Stable registration — child calls this; parent owns the registry. */
  registerItem: (item: RegisteredItem) => () => void
  isMatch: (text: string, value: string) => boolean
  onItemSelect: (value: string) => void
  /** Number of currently-visible (matching, non-disabled) items. */
  matchCount: number
  listId: string
  inputId: string
  baseId: string
  /** Stable callback-ref the input registers with so the parent owns its node. */
  registerInput: (node: HTMLInputElement | null) => void
}

const CommandContext = createContext<CommandContextValue | null>(null)

function useCommandContext(component: string) {
  const ctx = useContext(CommandContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Command>`)
  }
  return ctx
}

export interface CommandProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect' | 'onChange'> {
  /** Controlled highlighted item value. */
  value?: string
  /** Uncontrolled initial highlighted item value. */
  defaultValue?: string
  /** Notified when the highlighted item changes. */
  onValueChange?: (value: string | undefined) => void
  /** Custom matcher; return a truthy value to keep the item visible. */
  filter?: CommandFilter
  /** Called when an item is selected (Enter or click). */
  onSelect?: (value: string) => void
  children?: ReactNode
}

export const Command = forwardRef<HTMLDivElement, CommandProps>(function Command(
  { value, defaultValue, onValueChange, filter = defaultFilter, onSelect, className, children, ...rest },
  ref
) {
  const baseId = useId()
  const [search, setSearch] = useState('')
  const [activeValue, setActiveValue] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: onValueChange,
  })
  const inputRef = useRef<HTMLInputElement | null>(null)
  // Parent owns the registry; children register via the stable callback below.
  const [items, setItems] = useState<RegisteredItem[]>([])

  const registerInput = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node
  }, [])

  const registerItem = useCallback((item: RegisteredItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) {
        return prev.map((p) => (p.id === item.id ? item : p))
      }
      return [...prev, item]
    })
    return () => {
      setItems((prev) => prev.filter((p) => p.id !== item.id))
    }
  }, [])

  const isMatch = useCallback(
    (text: string, itemValue: string) => Boolean(filter(text || itemValue, search)),
    [filter, search]
  )

  const onItemSelect = useCallback(
    (itemValue: string) => {
      onSelect?.(itemValue)
    },
    [onSelect]
  )

  // The list of currently-visible (matching, non-disabled) item values, in DOM order.
  const visibleValues = useMemo(
    () => items.filter((i) => !i.disabled && isMatch(i.text, i.value)).map((i) => i.value),
    [items, isMatch]
  )

  // Keep an active item highlighted; when the filtered set changes, reset to the first match.
  useEffect(() => {
    if (visibleValues.length === 0) {
      if (activeValue !== undefined) setActiveValue(undefined)
      return
    }
    if (activeValue === undefined || !visibleValues.includes(activeValue)) {
      setActiveValue(visibleValues[0])
    }
    // setActiveValue is stable; activeValue intentionally read, not a trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleValues])

  const move = useCallback(
    (delta: number) => {
      if (visibleValues.length === 0) return
      const currentIndex = activeValue ? visibleValues.indexOf(activeValue) : -1
      let next = currentIndex + delta
      if (next < 0) next = visibleValues.length - 1
      if (next >= visibleValues.length) next = 0
      setActiveValue(visibleValues[next])
    },
    [visibleValues, activeValue, setActiveValue]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          move(1)
          break
        case 'ArrowUp':
          e.preventDefault()
          move(-1)
          break
        case 'Home':
          if (visibleValues.length > 0) {
            e.preventDefault()
            setActiveValue(visibleValues[0])
          }
          break
        case 'End':
          if (visibleValues.length > 0) {
            e.preventDefault()
            setActiveValue(visibleValues[visibleValues.length - 1])
          }
          break
        case 'Enter':
          if (activeValue !== undefined && visibleValues.includes(activeValue)) {
            e.preventDefault()
            onItemSelect(activeValue)
          }
          break
        default:
          break
      }
    },
    [move, visibleValues, activeValue, setActiveValue, onItemSelect]
  )

  const ctxValue = useMemo<CommandContextValue>(
    () => ({
      search,
      setSearch,
      activeValue,
      setActiveValue,
      filter,
      registerItem,
      isMatch,
      onItemSelect,
      matchCount: visibleValues.length,
      listId: `${baseId}-list`,
      inputId: `${baseId}-input`,
      baseId,
      registerInput,
    }),
    [
      search,
      activeValue,
      setActiveValue,
      filter,
      registerItem,
      isMatch,
      onItemSelect,
      visibleValues.length,
      baseId,
      registerInput,
    ]
  )

  return (
    <CommandContext.Provider value={ctxValue}>
      <div
        ref={ref}
        className={cn(styles.root, className)}
        onKeyDown={(e) => {
          rest.onKeyDown?.(e)
          handleKeyDown(e)
        }}
        {...rest}
      >
        {children}
      </div>
    </CommandContext.Provider>
  )
})

export interface CommandInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Controlled search value. */
  value?: string
  onValueChange?: (value: string) => void
}

export const CommandInput = forwardRef<HTMLInputElement, CommandInputProps>(function CommandInput(
  { value, onValueChange, className, placeholder = 'Type a command or search…', ...rest },
  ref
) {
  const ctx = useCommandContext('CommandInput')
  const search = value ?? ctx.search

  const setRef = useCallback(
    (node: HTMLInputElement | null) => {
      ctx.registerInput(node)
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    },
    [ctx, ref]
  )

  return (
    <div className={styles.inputWrap}>
      <svg
        className={styles.inputIcon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={setRef}
        id={ctx.inputId}
        type="text"
        role="combobox"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-expanded
        aria-controls={ctx.listId}
        aria-activedescendant={
          ctx.activeValue !== undefined ? `${ctx.baseId}-opt-${ctx.activeValue}` : undefined
        }
        className={cn(styles.input, className)}
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          if (value === undefined) ctx.setSearch(e.target.value)
          onValueChange?.(e.target.value)
        }}
        {...rest}
      />
    </div>
  )
})

export interface CommandListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

export const CommandList = forwardRef<HTMLDivElement, CommandListProps>(function CommandList(
  { className, children, ...rest },
  ref
) {
  const ctx = useCommandContext('CommandList')
  return (
    <div
      ref={ref}
      id={ctx.listId}
      role="listbox"
      className={cn(styles.list, className)}
      {...rest}
    >
      {children}
    </div>
  )
})

export interface CommandEmptyProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
}

/** Rendered only when there are no matching, visible items. */
export const CommandEmpty = forwardRef<HTMLDivElement, CommandEmptyProps>(function CommandEmpty(
  { className, children, ...rest },
  ref
) {
  const ctx = useCommandContext('CommandEmpty')
  if (ctx.matchCount > 0) return null
  return (
    <div ref={ref} role="presentation" className={cn(styles.empty, className)} {...rest}>
      {children}
    </div>
  )
})

export interface CommandGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  heading?: ReactNode
  children?: ReactNode
}

export const CommandGroup = forwardRef<HTMLDivElement, CommandGroupProps>(function CommandGroup(
  { heading, className, children, ...rest },
  ref
) {
  const headingId = useId()
  return (
    <div
      ref={ref}
      role="group"
      aria-labelledby={heading ? headingId : undefined}
      className={cn(styles.group, className)}
      {...rest}
    >
      {heading != null && (
        <div id={headingId} role="presentation" className={styles.groupHeading}>
          {heading}
        </div>
      )}
      <div role="presentation">{children}</div>
    </div>
  )
})

export interface CommandItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Stable identifier reported to onSelect; falls back to the text content. */
  value?: string
  onSelect?: (value: string) => void
  disabled?: boolean
  children?: ReactNode
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>(function CommandItem(
  { value, onSelect, disabled = false, className, children, ...rest },
  ref
) {
  const ctx = useCommandContext('CommandItem')
  const localRef = useRef<HTMLDivElement | null>(null)
  const generatedId = useId()
  const text = typeof children === 'string' ? children : (value ?? '')
  const itemValue = value ?? text

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      localRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    },
    [ref]
  )

  // Register with the parent registry; re-register if identity changes.
  useEffect(() => {
    return ctx.registerItem({ id: generatedId, value: itemValue, text, disabled })
  }, [ctx, generatedId, itemValue, text, disabled])

  const visible = ctx.isMatch(text, itemValue)
  const active = !disabled && ctx.activeValue === itemValue

  // Keep the active item scrolled into view (guarded for jsdom).
  useEffect(() => {
    if (active) localRef.current?.scrollIntoView?.({ block: 'nearest' })
  }, [active])

  if (!visible) return null

  return (
    <div
      ref={setRef}
      id={`${ctx.baseId}-opt-${itemValue}`}
      role="option"
      aria-selected={active}
      aria-disabled={disabled || undefined}
      data-disabled={disabled || undefined}
      data-active={active || undefined}
      className={cn(styles.item, className)}
      onPointerMove={() => {
        if (!disabled && ctx.activeValue !== itemValue) ctx.setActiveValue(itemValue)
      }}
      onClick={() => {
        if (disabled) return
        onSelect?.(itemValue)
        ctx.onItemSelect(itemValue)
      }}
      {...rest}
    >
      {children}
    </div>
  )
})

export type CommandSeparatorProps = HTMLAttributes<HTMLDivElement>

export const CommandSeparator = forwardRef<HTMLDivElement, CommandSeparatorProps>(
  function CommandSeparator({ className, ...rest }, ref) {
    return <div ref={ref} role="separator" className={cn(styles.separator, className)} {...rest} />
  }
)

export interface CommandShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode
}

export function CommandShortcut({ className, children, ...rest }: CommandShortcutProps) {
  return (
    <span className={cn(styles.shortcut, className)} {...rest}>
      {children}
    </span>
  )
}

export interface CommandDialogProps
  extends Pick<ModalProps, 'open' | 'onClose' | 'closeOnBackdrop'> {
  title?: ReactNode
  description?: ReactNode
  /** Forwarded to the inner <Command>. */
  commandProps?: Omit<CommandProps, 'children'>
  children?: ReactNode
}

/** A Command palette rendered inside the design system Modal/dialog. */
export function CommandDialog({
  open,
  onClose,
  closeOnBackdrop,
  title,
  description,
  commandProps,
  children,
}: CommandDialogProps) {
  return (
    <Modal open={open} onClose={onClose} closeOnBackdrop={closeOnBackdrop} title={title} description={description}>
      <Command className={styles.dialogCommand} {...commandProps}>
        {children}
      </Command>
    </Modal>
  )
}
