import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useId,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import styles from './Collapsible.module.css'

interface CollapsibleContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  disabled: boolean
  contentId: string
  triggerId: string
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null)

function useCollapsibleContext(component: string) {
  const ctx = useContext(CollapsibleContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Collapsible>`)
  }
  return ctx
}

export interface CollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  children: ReactNode
}

export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className,
  children,
  ...rest
}: CollapsibleProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const id = useId()

  const value = useMemo<CollapsibleContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      disabled,
      contentId: `${id}-content`,
      triggerId: `${id}-trigger`,
    }),
    [isOpen, setOpen, disabled, id]
  )

  return (
    <CollapsibleContext.Provider value={value}>
      <div
        className={cn(styles.root, className)}
        data-state={isOpen ? 'open' : 'closed'}
        data-disabled={disabled ? '' : undefined}
        {...rest}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  'aria-expanded'?: boolean
  'aria-controls'?: string
  id?: string
  'data-state'?: string
}

export interface CollapsibleTriggerProps {
  /** A single element (e.g. a <button>) rendered as the trigger (asChild semantics). */
  children: ReactElement<TriggerChildProps>
}

/** Renders the provided child element as the collapsible trigger (asChild semantics). */
export function CollapsibleTrigger({ children }: CollapsibleTriggerProps) {
  const ctx = useCollapsibleContext('CollapsibleTrigger')
  if (!isValidElement(children)) {
    throw new Error('<CollapsibleTrigger> expects a single React element child')
  }

  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      assignRef(childProps.ref, node)
    },
    id: childProps.id ?? ctx.triggerId,
    'aria-expanded': ctx.open,
    'aria-controls': ctx.contentId,
    'data-state': ctx.open ? 'open' : 'closed',
    disabled: childProps.disabled ?? ctx.disabled,
    onClick: (e: React.MouseEvent) => {
      childProps.onClick?.(e)
      if (ctx.disabled) return
      ctx.setOpen((prev) => !prev)
    },
  } as Partial<TriggerChildProps>)
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ className, children, ...rest }, ref) {
    const ctx = useCollapsibleContext('CollapsibleContent')
    return (
      <div
        ref={ref}
        id={ctx.contentId}
        role="region"
        aria-labelledby={ctx.triggerId}
        data-state={ctx.open ? 'open' : 'closed'}
        hidden={!ctx.open}
        className={cn(styles.content, className)}
        {...rest}
      >
        <div className={styles.inner}>{children}</div>
      </div>
    )
  }
)

function assignRef<T>(ref: Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value
}
