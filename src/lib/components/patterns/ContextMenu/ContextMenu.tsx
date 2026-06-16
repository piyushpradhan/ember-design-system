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
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
import { useDismiss } from '../../../utils/useDismiss'
import { useControllableState } from '../../../utils/useControllableState'
import {
  MenuRootProvider,
  MenuSurface,
  MenuItem,
  MenuCheckboxItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuLabel,
  MenuSeparator,
  MenuShortcut,
  MenuGroup,
  MenuSub,
  MenuSubTrigger,
  MenuSubContent,
  assignRef,
  type MenuRootContextValue,
  type MenuItemBaseProps,
  type MenuCheckboxItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuLabelProps,
  type MenuSubProps,
  type MenuSubTriggerProps,
  type MenuSubContentProps,
} from '../_menu'

/* ------------------------------------------------------------------ */
/* Context menu root — like the dropdown root, but the anchor is a
   virtual point at the pointer coordinates where the user right-clicked. */
/* ------------------------------------------------------------------ */

interface ContextMenuContextValue extends MenuRootContextValue {
  /** Set the pointer coordinates and open the menu. */
  openAt: (x: number, y: number) => void
  /** Current pointer coordinates (for positioning the virtual anchor). */
  pointRef: React.RefObject<{ x: number; y: number }>
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null)

function useContextMenu(component: string) {
  const ctx = useContext(ContextMenuContext)
  if (!ctx) throw new Error(`<${component}> must be used within <ContextMenu>`)
  return ctx
}

export interface ContextMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function ContextMenu({ open, defaultOpen = false, onOpenChange, children }: ContextMenuProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const pointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const id = useId()

  const registerContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
  }, [])

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
  }, [])

  const registerAnchor = useCallback((node: HTMLElement | null) => {
    anchorRef.current = node
  }, [])

  const focusTrigger = useCallback(() => {
    triggerRef.current?.focus?.()
  }, [])

  const openAt = useCallback(
    (x: number, y: number) => {
      pointRef.current = { x, y }
      setOpen(true)
    },
    [setOpen]
  )

  const ctx = useMemo<ContextMenuContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      contentId: `${id}-content`,
      triggerId: `${id}-trigger`,
      triggerRef,
      contentRef,
      anchorRef,
      registerContent,
      registerTrigger,
      registerAnchor,
      focusTrigger,
      openAt,
      pointRef,
    }),
    [isOpen, setOpen, id, registerContent, registerTrigger, registerAnchor, focusTrigger, openAt]
  )

  return (
    <ContextMenuContext.Provider value={ctx}>
      <MenuRootProvider value={ctx}>{children}</MenuRootProvider>
    </ContextMenuContext.Provider>
  )
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onContextMenu?: (e: React.MouseEvent) => void
}

export interface ContextMenuTriggerProps {
  children: ReactElement<TriggerChildProps>
}

export function ContextMenuTrigger({ children }: ContextMenuTriggerProps) {
  const root = useContextMenu('ContextMenuTrigger')
  if (!isValidElement(children)) {
    throw new Error('<ContextMenuTrigger> expects a single React element child')
  }
  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      root.registerTrigger(node)
      assignRef(childProps.ref, node)
    },
    onContextMenu: (e: React.MouseEvent) => {
      childProps.onContextMenu?.(e)
      e.preventDefault()
      root.openAt(e.clientX, e.clientY)
    },
  } as Partial<TriggerChildProps>)
}

export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Render into a portal. Default true. */
  portal?: boolean
}

export const ContextMenuContent = forwardRef<HTMLDivElement, ContextMenuContentProps>(
  function ContextMenuContent({ portal = true, style, children, ...rest }, forwardedRef) {
    const root = useContextMenu('ContextMenuContent')

    const dismissRefs = useMemo(() => [root.contentRef], [root.contentRef])
    const onDismiss = useCallback(() => {
      root.setOpen(false)
      root.focusTrigger()
    }, [root])
    useDismiss({ enabled: root.open, onDismiss, refs: dismissRefs })

    const setNode = useCallback(
      (node: HTMLDivElement | null) => {
        root.registerContent(node)
        assignRef(forwardedRef, node)
      },
      [root, forwardedRef]
    )

    if (!root.open) return null

    const { x, y } = root.pointRef.current
    const node = (
      <MenuSurface
        ref={setNode}
        id={root.contentId}
        data-side="bottom"
        data-state="open"
        style={{ position: 'fixed', top: y, left: x, ...style }}
        {...rest}
      >
        {children}
      </MenuSurface>
    )

    return portal ? createPortal(node, document.body) : node
  }
)

/* Item exports — thin re-exports of the shared primitives. */
export const ContextMenuItem = MenuItem
export const ContextMenuCheckboxItem = MenuCheckboxItem
export const ContextMenuRadioGroup = MenuRadioGroup
export const ContextMenuRadioItem = MenuRadioItem
export const ContextMenuLabel = MenuLabel
export const ContextMenuSeparator = MenuSeparator
export const ContextMenuShortcut = MenuShortcut
export const ContextMenuGroup = MenuGroup
export const ContextMenuSub = MenuSub
export const ContextMenuSubTrigger = MenuSubTrigger
export const ContextMenuSubContent = MenuSubContent

export type ContextMenuItemProps = MenuItemBaseProps
export type ContextMenuCheckboxItemProps = MenuCheckboxItemProps
export type ContextMenuRadioGroupProps = MenuRadioGroupProps
export type ContextMenuRadioItemProps = MenuRadioItemProps
export type ContextMenuLabelProps = MenuLabelProps
export type ContextMenuSubProps = MenuSubProps
export type ContextMenuSubTriggerProps = MenuSubTriggerProps
export type ContextMenuSubContentProps = MenuSubContentProps
