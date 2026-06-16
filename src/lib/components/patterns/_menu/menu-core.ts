/* Shared, internal non-component exports for the menu engine: contexts,
   hooks, helper functions and types used by the menu components and by the
   DropdownMenu / ContextMenu / Menubar families. Split out of menu.tsx so the
   component file only exports components (react-refresh/only-export-components). */

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { useControllableState } from '../../../utils/useControllableState'
import { type Align, type Placement, type Side } from '../../../utils/useFloating'
import styles from './menu.module.css'

export { styles as menuStyles }

export function assignRef<T>(ref: Ref<T> | undefined | null, value: T) {
  if (typeof ref === 'function') ref(value)
  else if (ref && typeof ref === 'object') (ref as React.MutableRefObject<T>).current = value
}

export function toPlacement(side: Side, align: Align): Placement {
  return (align === 'center' ? side : `${side}-${align}`) as Placement
}

/* ------------------------------------------------------------------ */
/* Menu list context — owns the items registry + highlight for a single
   open menu surface (a content panel). Each surface (root or submenu) has
   its own MenuListContext. */
/* ------------------------------------------------------------------ */

export interface MenuItemMeta {
  id: string
  /** Returns the DOM node for the item (for scrollIntoView + label lookup). */
  getNode: () => HTMLElement | null
  disabled: boolean
  /** Activate the item (click / Enter / Space). */
  onActivate: () => void
  /** Submenu trigger: open its submenu and focus the first child. */
  isSubTrigger: boolean
  openSub?: () => void
}

export interface MenuListContextValue {
  /** Stable callback for items to register themselves. */
  register: (meta: MenuItemMeta) => () => void
  highlightedId: string | null
  setHighlightedId: (id: string | null) => void
  /** Move highlight by direction or to an edge. */
  move: (dir: 'next' | 'prev' | 'first' | 'last') => void
  /** Activate the currently highlighted item. */
  activateHighlighted: () => void
  /** True for nested submenu surfaces. */
  isSubmenu: boolean
  /** Close the whole menu tree and return focus to the root trigger. */
  closeAll: () => void
  /** Close just this submenu surface (ArrowLeft / Escape inside a submenu). */
  closeSelf?: () => void
}

export const MenuListContext = createContext<MenuListContextValue | null>(null)
export const MenuListProvider = MenuListContext.Provider

export function useMenuList(component: string) {
  const ctx = useContext(MenuListContext)
  if (!ctx) throw new Error(`<${component}> must be used within a menu content surface`)
  return ctx
}

/* ------------------------------------------------------------------ */
/* Root context — open state + anchor + trigger/content refs, shared by
   all three families. closeAll returns focus to the root trigger. */
/* ------------------------------------------------------------------ */

export interface MenuRootContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  contentId: string
  triggerId: string
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLElement | null>
  anchorRef: React.RefObject<HTMLElement | null>
  registerContent: (node: HTMLElement | null) => void
  /** Stable callback for a trigger to register its DOM node. */
  registerTrigger: (node: HTMLElement | null) => void
  /** Stable callback for an anchor element to register its DOM node. */
  registerAnchor: (node: HTMLElement | null) => void
  /** Focus the trigger again (used on Escape / close). */
  focusTrigger: () => void
}

const MenuRootContext = createContext<MenuRootContextValue | null>(null)

export function useMenuRoot(component: string) {
  const ctx = useContext(MenuRootContext)
  if (!ctx) throw new Error(`<${component}> must be used within its menu root`)
  return ctx
}

export const MenuRootProvider = MenuRootContext.Provider

/** Shared open-state hook for the three roots. */
export function useMenuRootState({
  open,
  defaultOpen = false,
  onOpenChange,
}: {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}): MenuRootContextValue {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
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

  return useMemo<MenuRootContextValue>(
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
    }),
    [isOpen, setOpen, id, registerContent, registerTrigger, registerAnchor, focusTrigger]
  )
}

/* ------------------------------------------------------------------ */
/* Item base props — shared by all item primitives. */
/* ------------------------------------------------------------------ */

export interface MenuItemBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  disabled?: boolean
  inset?: boolean
  variant?: 'default' | 'danger'
  /** Called when the item is activated. Call preventDefault to keep open. */
  onSelect?: (event: { preventDefault: () => void }) => void
}

/* ------------------------------------------------------------------ */
/* Submenu context — a nested popover anchored to its trigger item. */
/* ------------------------------------------------------------------ */

export interface SubContextValue {
  open: boolean
  setOpen: (next: boolean | ((prev: boolean) => boolean)) => void
  triggerRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLElement | null>
  anchorRef: React.RefObject<HTMLElement | null>
  /** Stable callback for the trigger to register its DOM node (also anchor). */
  registerTrigger: (node: HTMLElement | null) => void
  /** Stable callback for the content surface to register its DOM node. */
  registerContent: (node: HTMLElement | null) => void
  contentId: string
}

const SubContext = createContext<SubContextValue | null>(null)
export const SubContextProvider = SubContext.Provider

export function useSubContext(component: string) {
  const ctx = useContext(SubContext)
  if (!ctx) throw new Error(`<${component}> must be used within a submenu root`)
  return ctx
}

export interface MenuSubProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}
