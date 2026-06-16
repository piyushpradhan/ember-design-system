import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { useFloating, type Align, type Placement, type Side } from '../../../utils/useFloating'
import styles from './HoverCard.module.css'

interface HoverCardContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  openWithDelay: () => void
  closeWithDelay: () => void
  cancelTimers: () => void
  anchorRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  registerTrigger: (node: HTMLElement | null) => void
  registerContent: (node: HTMLElement | null) => void
  contentId: string
  triggerId: string
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null)

function useHoverCardContext(component: string) {
  const ctx = useContext(HoverCardContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <HoverCard>`)
  }
  return ctx
}

export interface HoverCardProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Delay in ms before the card opens on hover/focus. Default 200. */
  openDelay?: number
  /** Delay in ms before the card closes on leave/blur. Default 150. */
  closeDelay?: number
  children: ReactNode
}

export function HoverCard({
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 200,
  closeDelay = 150,
  children,
}: HoverCardProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const anchorRef = useRef<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const id = useId()

  const cancelTimers = useCallback(() => {
    if (openTimer.current != null) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }
    if (closeTimer.current != null) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const openWithDelay = useCallback(() => {
    cancelTimers()
    openTimer.current = setTimeout(() => {
      openTimer.current = null
      setOpen(true)
    }, openDelay)
  }, [cancelTimers, openDelay, setOpen])

  const closeWithDelay = useCallback(() => {
    cancelTimers()
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      setOpen(false)
    }, closeDelay)
  }, [cancelTimers, closeDelay, setOpen])

  // Clean up any pending timers on unmount.
  useEffect(() => cancelTimers, [cancelTimers])

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
    anchorRef.current = node
  }, [])
  const registerContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
  }, [])

  const value = useMemo<HoverCardContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      openWithDelay,
      closeWithDelay,
      cancelTimers,
      anchorRef,
      triggerRef,
      contentRef,
      registerTrigger,
      registerContent,
      contentId: `${id}-content`,
      triggerId: `${id}-trigger`,
    }),
    [isOpen, setOpen, openWithDelay, closeWithDelay, cancelTimers, registerTrigger, registerContent, id]
  )

  return <HoverCardContext.Provider value={value}>{children}</HoverCardContext.Provider>
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onMouseEnter?: (e: React.MouseEvent) => void
  onMouseLeave?: (e: React.MouseEvent) => void
  onFocus?: (e: React.FocusEvent) => void
  onBlur?: (e: React.FocusEvent) => void
  'aria-expanded'?: boolean
  'aria-controls'?: string
  id?: string
}

export interface HoverCardTriggerProps {
  children: ReactElement<TriggerChildProps>
}

/** Renders the provided child element as the hover-card trigger (asChild semantics). */
export function HoverCardTrigger({ children }: HoverCardTriggerProps) {
  const ctx = useHoverCardContext('HoverCardTrigger')
  if (!isValidElement(children)) {
    throw new Error('<HoverCardTrigger> expects a single React element child')
  }

  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      ctx.registerTrigger(node)
      assignRef(childProps.ref, node)
    },
    id: childProps.id ?? ctx.triggerId,
    'aria-expanded': ctx.open,
    'aria-controls': ctx.open ? ctx.contentId : undefined,
    onMouseEnter: (e: React.MouseEvent) => {
      childProps.onMouseEnter?.(e)
      ctx.openWithDelay()
    },
    onMouseLeave: (e: React.MouseEvent) => {
      childProps.onMouseLeave?.(e)
      ctx.closeWithDelay()
    },
    onFocus: (e: React.FocusEvent) => {
      childProps.onFocus?.(e)
      ctx.openWithDelay()
    },
    onBlur: (e: React.FocusEvent) => {
      childProps.onBlur?.(e)
      ctx.closeWithDelay()
    },
  } as Partial<TriggerChildProps>)
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred side to position the card. Default 'bottom'. */
  placement?: Side
  /** Alignment along the side. Default 'center'. */
  align?: Align
  /** Gap in px between the trigger and the card. Default 8. */
  offset?: number
  /** Render into a portal at document.body. Default true. */
  portal?: boolean
  role?: string
}

export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(function HoverCardContent(
  {
    placement = 'bottom',
    align = 'center',
    offset = 8,
    portal = true,
    role = 'dialog',
    className,
    style,
    children,
    onMouseEnter,
    onMouseLeave,
    onFocus,
    onBlur,
    ...rest
  },
  forwardedRef
) {
  const ctx = useHoverCardContext('HoverCardContent')
  const resolvedPlacement = (align === 'center' ? placement : `${placement}-${align}`) as Placement

  const { floatingRef, style: floatStyle, side } = useFloating({
    placement: resolvedPlacement,
    offset,
    open: ctx.open,
    anchorRef: ctx.anchorRef,
  })

  // Escape closes immediately (no delay).
  useEffect(() => {
    if (!ctx.open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        ctx.cancelTimers()
        ctx.setOpen(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [ctx])

  const setContentNode = useCallback(
    (el: HTMLDivElement | null) => {
      ctx.registerContent(el)
      floatingRef.current = el
      assignRef(forwardedRef, el)
    },
    [ctx, floatingRef, forwardedRef]
  )

  if (!ctx.open) return null

  const node = (
    <div
      ref={setContentNode}
      id={ctx.contentId}
      role={role}
      data-side={side}
      data-state={ctx.open ? 'open' : 'closed'}
      className={cn(styles.content, className)}
      style={{ ...floatStyle, ...style }}
      // Keeping the pointer/focus over the content keeps the card open.
      onMouseEnter={(e) => {
        onMouseEnter?.(e)
        ctx.cancelTimers()
      }}
      onMouseLeave={(e) => {
        onMouseLeave?.(e)
        ctx.closeWithDelay()
      }}
      onFocus={(e) => {
        onFocus?.(e)
        ctx.cancelTimers()
      }}
      onBlur={(e) => {
        onBlur?.(e)
        ctx.closeWithDelay()
      }}
      {...rest}
    >
      {children}
    </div>
  )

  return portal ? createPortal(node, document.body) : node
})

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value
}
