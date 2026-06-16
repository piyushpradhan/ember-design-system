import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import toggleStyles from '../Toggle/Toggle.module.css'
import styles from './ToggleGroup.module.css'

export type ToggleGroupVariant = 'default' | 'outline'
export type ToggleGroupSize = 'sm' | 'md' | 'lg'
export type ToggleGroupOrientation = 'horizontal' | 'vertical'

interface ToggleGroupContextValue {
  variant: ToggleGroupVariant
  size: ToggleGroupSize
  disabled: boolean
  orientation: ToggleGroupOrientation
  isPressed: (value: string) => boolean
  toggle: (value: string) => void
  register: (value: string, node: HTMLButtonElement | null) => void
  onItemKeyDown: (event: KeyboardEvent<HTMLButtonElement>, value: string) => void
  isFocusable: (value: string) => boolean
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null)

type ToggleGroupBaseProps = Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> & {
  variant?: ToggleGroupVariant
  size?: ToggleGroupSize
  disabled?: boolean
  orientation?: ToggleGroupOrientation
}

export type ToggleGroupSingleProps = ToggleGroupBaseProps & {
  type: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

export type ToggleGroupMultipleProps = ToggleGroupBaseProps & {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = ToggleGroupSingleProps | ToggleGroupMultipleProps

export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(
  props,
  ref
) {
  const {
    variant = 'default',
    size = 'md',
    disabled = false,
    orientation = 'horizontal',
    className,
    children,
    ...rest
  } = props

  // Order of items as they register, used for arrow-key navigation. Mirrored
  // into state so roving-tabindex re-renders once items have registered.
  const orderRef = useRef<string[]>([])
  const nodesRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const [order, setOrder] = useState<string[]>([])

  const register = useCallback((value: string, node: HTMLButtonElement | null) => {
    if (node) {
      nodesRef.current.set(value, node)
      if (!orderRef.current.includes(value)) {
        orderRef.current = [...orderRef.current, value]
        setOrder(orderRef.current)
      }
    } else {
      nodesRef.current.delete(value)
      if (orderRef.current.includes(value)) {
        orderRef.current = orderRef.current.filter((v) => v !== value)
        setOrder(orderRef.current)
      }
    }
  }, [])

  // Normalise the controlled/uncontrolled state to an array internally.
  const isSingle = props.type === 'single'

  const [selected, setSelected] = useControllableState<string[]>({
    value:
      props.value === undefined
        ? undefined
        : isSingle
          ? props.value
            ? [props.value as string]
            : []
          : (props.value as string[]),
    defaultValue: isSingle
      ? props.defaultValue
        ? [props.defaultValue as string]
        : []
      : ((props.defaultValue as string[] | undefined) ?? []),
    onChange: (next) => {
      if (isSingle) {
        ;(props.onValueChange as ((v: string) => void) | undefined)?.(next[0] ?? '')
      } else {
        ;(props.onValueChange as ((v: string[]) => void) | undefined)?.(next)
      }
    },
  })

  const isPressed = useCallback((value: string) => selected.includes(value), [selected])

  const toggle = useCallback(
    (value: string) => {
      if (isSingle) {
        setSelected((prev) => (prev.includes(value) ? [] : [value]))
      } else {
        setSelected((prev) =>
          prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
        )
      }
    },
    [isSingle, setSelected]
  )

  const isFocusable = useCallback(
    (value: string) => {
      // The first selected item is focusable; if none selected, the first item.
      const firstSelected = order.find((v) => selected.includes(v))
      if (firstSelected) return firstSelected === value
      return order[0] === value
    },
    [order, selected]
  )

  const focusItem = useCallback((value: string) => {
    nodesRef.current.get(value)?.focus()
  }, [])

  const onItemKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, value: string) => {
      const order = orderRef.current
      const count = order.length
      if (count === 0) return
      const index = order.indexOf(value)
      const isHorizontal = orientation === 'horizontal'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'

      let nextIndex: number
      switch (event.key) {
        case nextKey:
          nextIndex = (index + 1) % count
          break
        case prevKey:
          nextIndex = (index - 1 + count) % count
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = count - 1
          break
        default:
          return
      }
      event.preventDefault()
      focusItem(order[nextIndex])
    },
    [orientation, focusItem]
  )

  const contextValue = useMemo<ToggleGroupContextValue>(
    () => ({
      variant,
      size,
      disabled,
      orientation,
      isPressed,
      toggle,
      register,
      onItemKeyDown,
      isFocusable,
    }),
    [variant, size, disabled, orientation, isPressed, toggle, register, onItemKeyDown, isFocusable]
  )

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="group"
        data-orientation={orientation}
        className={cn(styles.group, styles[`orientation-${orientation}`], className)}
        {...rest}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})

export interface ToggleGroupItemProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: string
}

export const ToggleGroupItem = forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  function ToggleGroupItem(
    { value, className, disabled, type = 'button', children, onClick, onKeyDown, ...rest },
    ref
  ) {
    const ctx = useContext(ToggleGroupContext)
    if (!ctx) {
      throw new Error('ToggleGroupItem must be used within a ToggleGroup')
    }

    const pressed = ctx.isPressed(value)
    const isDisabled = ctx.disabled || disabled

    // Depend only on the stable `register` (not the whole context, whose
    // identity changes each render) so the callback ref isn't re-invoked —
    // which would thrash registration and loop.
    const { register } = ctx
    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        register(value, node)
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [register, value, ref]
    )

    return (
      <button
        ref={setRef}
        type={type}
        disabled={isDisabled}
        aria-pressed={pressed}
        data-state={pressed ? 'on' : 'off'}
        tabIndex={ctx.isFocusable(value) ? 0 : -1}
        className={cn(
          toggleStyles.toggle,
          toggleStyles[`variant-${ctx.variant}`],
          toggleStyles[`size-${ctx.size}`],
          styles.item,
          className
        )}
        onClick={(event) => {
          onClick?.(event)
          if (event.defaultPrevented) return
          ctx.toggle(value)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented) return
          ctx.onItemKeyDown(event, value)
        }}
        {...rest}
      >
        {children}
      </button>
    )
  }
)
