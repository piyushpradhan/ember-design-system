import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { useDismiss } from '../../../utils/useDismiss'
import { useFloating, type Align, type Side } from '../../../utils/useFloating'
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
  useMenuRoot,
  useMenuRootState,
  assignRef,
  toPlacement,
  menuStyles,
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
/* Menubar context — tracks which top-level menu is open and owns a
   registry of triggers for ArrowLeft/Right navigation. */
/* ------------------------------------------------------------------ */

interface MenubarTriggerMeta {
  value: string
  focus: () => void
}

interface MenubarContextValue {
  /** The value of the currently open menu, or null. */
  openValue: string | null
  setOpenValue: (value: (string | null) | ((prev: string | null) => string | null)) => void
  register: (meta: MenubarTriggerMeta) => () => void
  /** Move focus (and, when a menu is open, the open menu) to a sibling. */
  moveTrigger: (from: string, dir: 'next' | 'prev') => void
}

const MenubarContext = createContext<MenubarContextValue | null>(null)

function useMenubar(component: string) {
  const ctx = useContext(MenubarContext)
  if (!ctx) throw new Error(`<${component}> must be used within <Menubar>`)
  return ctx
}

export interface MenubarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Controlled value of the open menu. */
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

export const Menubar = forwardRef<HTMLDivElement, MenubarProps>(function Menubar(
  { value, defaultValue = null, onValueChange, className, children, ...rest },
  forwardedRef
) {
  const [openValue, setOpenValue] = useControllableState<string | null>({
    value,
    defaultValue,
    onChange: onValueChange,
  })

  const triggersRef = useRef<MenubarTriggerMeta[]>([])

  const register = useCallback((meta: MenubarTriggerMeta) => {
    triggersRef.current = [...triggersRef.current, meta]
    return () => {
      triggersRef.current = triggersRef.current.filter((m) => m.value !== meta.value)
    }
  }, [])

  const moveTrigger = useCallback(
    (from: string, dir: 'next' | 'prev') => {
      const triggers = triggersRef.current
      if (triggers.length === 0) return
      const idx = triggers.findIndex((m) => m.value === from)
      if (idx === -1) return
      const delta = dir === 'next' ? 1 : -1
      const next = triggers[(idx + delta + triggers.length) % triggers.length]
      next.focus()
      setOpenValue((prev) => (prev !== null ? next.value : prev))
    },
    [setOpenValue]
  )

  const ctx = useMemo<MenubarContextValue>(
    () => ({ openValue, setOpenValue, register, moveTrigger }),
    [openValue, setOpenValue, register, moveTrigger]
  )

  return (
    <MenubarContext.Provider value={ctx}>
      <div
        ref={forwardedRef}
        role="menubar"
        className={cn(menuStyles.menubar, className)}
        {...rest}
      >
        {children}
      </div>
    </MenubarContext.Provider>
  )
})

/* ------------------------------------------------------------------ */
/* MenubarMenu — one menu in the bar. Wires its open state to the bar's
   active value so only one is open at a time. */
/* ------------------------------------------------------------------ */

interface MenubarMenuContextValue {
  value: string
}
const MenubarMenuContext = createContext<MenubarMenuContextValue | null>(null)
function useMenubarMenu(component: string) {
  const ctx = useContext(MenubarMenuContext)
  if (!ctx) throw new Error(`<${component}> must be used within <MenubarMenu>`)
  return ctx
}

export interface MenubarMenuProps {
  /** Stable identifier for this menu. Defaults to an auto-generated id. */
  value?: string
  children: ReactNode
}

export function MenubarMenu({ value, children }: MenubarMenuProps) {
  const bar = useMenubar('MenubarMenu')
  const autoId = useId()
  const menuValue = value ?? autoId

  const open = bar.openValue === menuValue
  const onOpenChange = useCallback(
    (next: boolean) => {
      bar.setOpenValue(next ? menuValue : null)
    },
    [bar, menuValue]
  )

  const root = useMenuRootState({ open, onOpenChange })

  const menuCtx = useMemo(() => ({ value: menuValue }), [menuValue])

  return (
    <MenubarMenuContext.Provider value={menuCtx}>
      <MenuRootProvider value={root}>{children}</MenuRootProvider>
    </MenubarMenuContext.Provider>
  )
}

export interface MenubarTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  disabled?: boolean
}

export const MenubarTrigger = forwardRef<HTMLButtonElement, MenubarTriggerProps>(
  function MenubarTrigger({ disabled = false, className, children, onClick, onKeyDown, onPointerEnter, ...rest }, forwardedRef) {
    const bar = useMenubar('MenubarTrigger')
    const menu = useMenubarMenu('MenubarTrigger')
    const root = useMenuRoot('MenubarTrigger')
    const nodeRef = useRef<HTMLButtonElement | null>(null)

    const focus = useCallback(() => {
      nodeRef.current?.focus?.()
    }, [])

    // Register this trigger with the bar for arrow navigation.
    useEffect(() => {
      return bar.register({ value: menu.value, focus })
    }, [bar, menu.value, focus])

    const setNode = useCallback(
      (node: HTMLButtonElement | null) => {
        nodeRef.current = node
        root.registerTrigger(node)
        root.registerAnchor(node)
        assignRef(forwardedRef, node)
      },
      [root, forwardedRef]
    )

    const handleKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e)
        if (e.defaultPrevented) return
        switch (e.key) {
          case 'ArrowRight':
            e.preventDefault()
            bar.moveTrigger(menu.value, 'next')
            break
          case 'ArrowLeft':
            e.preventDefault()
            bar.moveTrigger(menu.value, 'prev')
            break
          case 'ArrowDown':
          case 'Enter':
          case ' ':
            e.preventDefault()
            bar.setOpenValue(menu.value)
            break
        }
      },
      [onKeyDown, bar, menu.value]
    )

    return (
      <button
        ref={setNode}
        type="button"
        role="menuitem"
        id={root.triggerId}
        aria-haspopup="menu"
        aria-expanded={root.open}
        aria-controls={root.open ? root.contentId : undefined}
        aria-disabled={disabled || undefined}
        disabled={disabled}
        data-state={root.open ? 'open' : 'closed'}
        className={cn(menuStyles.menubarTrigger, className)}
        tabIndex={disabled ? -1 : 0}
        onClick={(e) => {
          onClick?.(e)
          if (disabled) return
          bar.setOpenValue(root.open ? null : menu.value)
        }}
        onPointerEnter={(e) => {
          onPointerEnter?.(e)
          if (disabled) return
          // If a menu is already open, hovering switches to this one.
          bar.setOpenValue((prev) => (prev !== null ? menu.value : prev))
        }}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </button>
    )
  }
)

export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred side. Default 'bottom'. */
  placement?: Side
  /** Alignment along the side. Default 'start'. */
  align?: Align
  offset?: number
  /** Render into a portal. Default true. */
  portal?: boolean
}

export const MenubarContent = forwardRef<HTMLDivElement, MenubarContentProps>(
  function MenubarContent(
    { placement = 'bottom', align = 'start', offset = 6, portal = true, style, children, ...rest },
    forwardedRef
  ) {
    const root = useMenuRoot('MenubarContent')
    const { floatingRef, style: floatStyle, side } = useFloating({
      placement: toPlacement(placement, align),
      offset,
      open: root.open,
      anchorRef: root.anchorRef,
    })

    const dismissRefs = useMemo(() => [root.triggerRef, root.contentRef], [root.triggerRef, root.contentRef])
    const onDismiss = useCallback(() => {
      root.setOpen(false)
      root.focusTrigger()
    }, [root])
    useDismiss({ enabled: root.open, onDismiss, refs: dismissRefs })

    const setNode = useCallback(
      (node: HTMLDivElement | null) => {
        root.registerContent(node)
        floatingRef.current = node
        assignRef(forwardedRef, node)
      },
      [root, floatingRef, forwardedRef]
    )

    if (!root.open) return null

    const node = (
      <MenuSurface
        ref={setNode}
        id={root.contentId}
        aria-labelledby={root.triggerId}
        data-side={side}
        data-state="open"
        style={{ ...floatStyle, ...style }}
        {...rest}
      >
        {children}
      </MenuSurface>
    )

    return portal ? createPortal(node, document.body) : node
  }
)

/* Item exports — thin re-exports of the shared primitives. */
export const MenubarItem = MenuItem
export const MenubarCheckboxItem = MenuCheckboxItem
export const MenubarRadioGroup = MenuRadioGroup
export const MenubarRadioItem = MenuRadioItem
export const MenubarLabel = MenuLabel
export const MenubarSeparator = MenuSeparator
export const MenubarShortcut = MenuShortcut
export const MenubarGroup = MenuGroup
export const MenubarSub = MenuSub
export const MenubarSubTrigger = MenuSubTrigger
export const MenubarSubContent = MenuSubContent

export type MenubarItemProps = MenuItemBaseProps
export type MenubarCheckboxItemProps = MenuCheckboxItemProps
export type MenubarRadioGroupProps = MenuRadioGroupProps
export type MenubarRadioItemProps = MenuRadioItemProps
export type MenubarLabelProps = MenuLabelProps
export type MenubarSubProps = MenuSubProps
export type MenubarSubTriggerProps = MenuSubTriggerProps
export type MenubarSubContentProps = MenuSubContentProps
