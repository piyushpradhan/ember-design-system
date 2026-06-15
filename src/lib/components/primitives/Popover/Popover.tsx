import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { useDismiss } from '../../../utils/useDismiss'
import { useFloating, type Placement } from '../../../utils/useFloating'
import styles from './Popover.module.css'

interface PopoverContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  anchorRef: RefObject<HTMLElement | null>
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  registerTrigger: (node: HTMLElement | null) => void
  registerAnchor: (node: HTMLElement | null) => void
  registerContent: (node: HTMLElement | null) => void
  contentId: string
  triggerId: string
}

const PopoverContext = createContext<PopoverContextValue | null>(null)

function usePopoverContext(component: string) {
  const ctx = useContext(PopoverContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Popover>`)
  }
  return ctx
}

export interface PopoverProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function Popover({ open, defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const anchorRef = useRef<HTMLElement | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const explicitAnchor = useRef(false)
  const id = useId()

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
    if (!explicitAnchor.current) anchorRef.current = node
  }, [])
  const registerAnchor = useCallback((node: HTMLElement | null) => {
    explicitAnchor.current = node != null
    anchorRef.current = node
  }, [])
  const registerContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
  }, [])

  const value = useMemo<PopoverContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      anchorRef,
      triggerRef,
      contentRef,
      registerTrigger,
      registerAnchor,
      registerContent,
      contentId: `${id}-content`,
      triggerId: `${id}-trigger`,
    }),
    [isOpen, setOpen, registerTrigger, registerAnchor, registerContent, id]
  )

  return <PopoverContext.Provider value={value}>{children}</PopoverContext.Provider>
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: React.MouseEvent) => void
  'aria-expanded'?: boolean
  'aria-haspopup'?: string
  'aria-controls'?: string
  id?: string
}

export interface PopoverTriggerProps {
  children: ReactElement<TriggerChildProps>
}

/** Renders the provided child element as the popover trigger (asChild semantics). */
export function PopoverTrigger({ children }: PopoverTriggerProps) {
  const ctx = usePopoverContext('PopoverTrigger')
  if (!isValidElement(children)) {
    throw new Error('<PopoverTrigger> expects a single React element child')
  }

  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      ctx.registerTrigger(node)
      assignRef(childProps.ref, node)
    },
    id: childProps.id ?? ctx.triggerId,
    'aria-haspopup': 'dialog',
    'aria-expanded': ctx.open,
    'aria-controls': ctx.open ? ctx.contentId : undefined,
    onClick: (e: React.MouseEvent) => {
      childProps.onClick?.(e)
      ctx.setOpen((prev) => !prev)
    },
  } as Partial<TriggerChildProps>)
}

/** Optional explicit anchor when the trigger isn't the positioning reference. */
export function PopoverAnchor({ children }: { children: ReactElement<{ ref?: Ref<HTMLElement> }> }) {
  const ctx = usePopoverContext('PopoverAnchor')
  if (!isValidElement(children)) {
    throw new Error('<PopoverAnchor> expects a single React element child')
  }
  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      ctx.registerAnchor(node)
      assignRef(childProps.ref, node)
    },
  })
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  placement?: Placement
  offset?: number
  matchWidth?: boolean
  /** Close when a pointer press lands outside the content/trigger. Default true. */
  dismissOnOutside?: boolean
  /** Render into a portal at document.body. Default true. */
  portal?: boolean
  role?: string
}

export const PopoverContent = forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    placement = 'bottom',
    offset = 8,
    matchWidth = false,
    dismissOnOutside = true,
    portal = true,
    role = 'dialog',
    className,
    style,
    children,
    ...rest
  },
  forwardedRef
) {
  const ctx = usePopoverContext('PopoverContent')
  const { floatingRef, style: floatStyle, side } = useFloating({
    placement,
    offset,
    matchWidth,
    open: ctx.open,
    anchorRef: ctx.anchorRef,
  })

  const dismissRefs = useMemo(() => [ctx.triggerRef, ctx.contentRef], [ctx.triggerRef, ctx.contentRef])
  useDismiss({
    enabled: ctx.open,
    onDismiss: () => ctx.setOpen(false),
    refs: dismissRefs,
    escapeKey: true,
    outsidePress: dismissOnOutside,
  })

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
      {...rest}
    >
      {children}
    </div>
  )

  return portal ? createPortal(node, document.body) : node
})

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

/** A button that closes the popover when clicked. */
export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
  { onClick, ...rest },
  ref
) {
  const ctx = usePopoverContext('PopoverClose')
  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => {
        onClick?.(e)
        ctx.setOpen(false)
      }}
      {...rest}
    />
  )
})

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value
}
