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
  useState,
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
import { Button } from '../../primitives/Button'
import styles from './AlertDialog.module.css'

interface AlertDialogContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  triggerRef: RefObject<HTMLElement | null>
  contentRef: RefObject<HTMLElement | null>
  registerTrigger: (node: HTMLElement | null) => void
  registerContent: (node: HTMLElement | null) => void
  titleId: string
  descriptionId: string
  hasTitle: boolean
  hasDescription: boolean
  setHasTitle: (value: boolean) => void
  setHasDescription: (value: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

function useAlertDialogContext(component: string) {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <AlertDialog>`)
  }
  return ctx
}

export interface AlertDialogProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function AlertDialog({ open, defaultOpen = false, onOpenChange, children }: AlertDialogProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const [hasTitle, setHasTitle] = useState(false)
  const [hasDescription, setHasDescription] = useState(false)
  const id = useId()

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])
  const registerContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
  }, [])

  const value = useMemo<AlertDialogContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      triggerRef,
      contentRef,
      registerTrigger,
      registerContent,
      titleId: `${id}-title`,
      descriptionId: `${id}-description`,
      hasTitle,
      hasDescription,
      setHasTitle,
      setHasDescription,
    }),
    [isOpen, setOpen, registerTrigger, registerContent, hasTitle, hasDescription, id]
  )

  return <AlertDialogContext.Provider value={value}>{children}</AlertDialogContext.Provider>
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: React.MouseEvent) => void
  'aria-haspopup'?: string
  id?: string
}

export interface AlertDialogTriggerProps {
  children: ReactElement<TriggerChildProps>
}

/** Renders the provided child element as the alert-dialog trigger (asChild semantics). */
export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const ctx = useAlertDialogContext('AlertDialogTrigger')
  if (!isValidElement(children)) {
    throw new Error('<AlertDialogTrigger> expects a single React element child')
  }
  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      ctx.registerTrigger(node)
      assignRef(childProps.ref, node)
    },
    'aria-haspopup': 'dialog',
    onClick: (e: React.MouseEvent) => {
      childProps.onClick?.(e)
      ctx.setOpen(true)
    },
  } as Partial<TriggerChildProps>)
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

export interface AlertDialogContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Render into a portal at document.body. Default true. */
  portal?: boolean
}

export const AlertDialogContent = forwardRef<HTMLDivElement, AlertDialogContentProps>(
  function AlertDialogContent({ portal = true, className, children, ...rest }, forwardedRef) {
    const ctx = useAlertDialogContext('AlertDialogContent')

    const setContentNode = useCallback(
      (el: HTMLDivElement | null) => {
        ctx.registerContent(el)
        assignRef(forwardedRef, el)
      },
      [ctx, forwardedRef]
    )

    // Body scroll lock, Escape to close, initial focus, and focus restoration.
    useEffect(() => {
      if (!ctx.open) return
      const previousFocus = document.activeElement as HTMLElement | null
      const previousOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'

      const content = ctx.contentRef.current
      // Move focus into the dialog: first focusable, else the dialog itself.
      const first = content?.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
      ;(first ?? content)?.focus()

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.stopPropagation()
          ctx.setOpen(false)
          return
        }
        if (e.key === 'Tab') {
          trapFocus(e, content)
        }
      }
      document.addEventListener('keydown', onKeyDown, true)

      return () => {
        document.removeEventListener('keydown', onKeyDown, true)
        document.body.style.overflow = previousOverflow
        // Return focus to whatever was focused before opening (the trigger).
        previousFocus?.focus?.()
      }
      // ctx is stable across renders for the relevant fields; open drives the effect.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ctx.open])

    if (!ctx.open) return null

    const node = (
      <div className={styles.backdrop}>
        <div
          ref={setContentNode}
          role="alertdialog"
          aria-modal="true"
          aria-labelledby={ctx.hasTitle ? ctx.titleId : undefined}
          aria-describedby={ctx.hasDescription ? ctx.descriptionId : undefined}
          tabIndex={-1}
          data-state={ctx.open ? 'open' : 'closed'}
          className={cn(styles.content, className)}
          {...rest}
        >
          {children}
        </div>
      </div>
    )

    return portal ? createPortal(node, document.body) : node
  }
)

function trapFocus(e: KeyboardEvent, container: HTMLElement | null | undefined) {
  if (!container) return
  const focusable = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement
  )
  if (focusable.length === 0) {
    e.preventDefault()
    container.focus()
    return
  }
  const first = focusable[0]
  const last = focusable[focusable.length - 1]
  const active = document.activeElement as HTMLElement | null

  if (e.shiftKey) {
    if (active === first || active === container || !container.contains(active)) {
      e.preventDefault()
      last.focus()
    }
  } else {
    if (active === last) {
      e.preventDefault()
      first.focus()
    }
  }
}

export const AlertDialogHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogHeader({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.header, className)} {...rest} />
  }
)

export const AlertDialogFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function AlertDialogFooter({ className, ...rest }, ref) {
    return <div ref={ref} className={cn(styles.footer, className)} {...rest} />
  }
)

export const AlertDialogTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  function AlertDialogTitle({ className, ...rest }, ref) {
    const ctx = useAlertDialogContext('AlertDialogTitle')
    useEffect(() => {
      ctx.setHasTitle(true)
      return () => ctx.setHasTitle(false)
    }, [ctx])
    return <h2 ref={ref} id={ctx.titleId} className={cn(styles.title, className)} {...rest} />
  }
)

export const AlertDialogDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  function AlertDialogDescription({ className, ...rest }, ref) {
    const ctx = useAlertDialogContext('AlertDialogDescription')
    useEffect(() => {
      ctx.setHasDescription(true)
      return () => ctx.setHasDescription(false)
    }, [ctx])
    return <p ref={ref} id={ctx.descriptionId} className={cn(styles.description, className)} {...rest} />
  }
)

export interface AlertDialogActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

/** Confirms the action and closes the dialog. Rendered as a primary Button. */
export const AlertDialogAction = forwardRef<HTMLButtonElement, AlertDialogActionProps>(
  function AlertDialogAction({ onClick, children, ...rest }, ref) {
    const ctx = useAlertDialogContext('AlertDialogAction')
    return (
      <Button
        ref={ref}
        variant="primary"
        onClick={(e) => {
          onClick?.(e)
          ctx.setOpen(false)
        }}
        {...rest}
      >
        {children}
      </Button>
    )
  }
)

export interface AlertDialogCancelProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

/** Dismisses the dialog without confirming. Rendered as a secondary Button. */
export const AlertDialogCancel = forwardRef<HTMLButtonElement, AlertDialogCancelProps>(
  function AlertDialogCancel({ onClick, children, ...rest }, ref) {
    const ctx = useAlertDialogContext('AlertDialogCancel')
    return (
      <Button
        ref={ref}
        variant="secondary"
        onClick={(e) => {
          onClick?.(e)
          ctx.setOpen(false)
        }}
        {...rest}
      >
        {children}
      </Button>
    )
  }
)

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value
}
