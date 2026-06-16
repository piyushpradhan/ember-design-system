/* Shared, internal menu engine for DropdownMenu, ContextMenu and Menubar.
   NOT exported from the library barrel. Provides the menu surface, item
   primitives and full keyboard a11y (roving highlight via active-descendant,
   typeahead, Home/End, submenu arrows, Enter/Space/Escape). */

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
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { ChevronRight, Check, Circle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import { useFloating } from '../../../utils/useFloating'
import styles from './menu.module.css'
import {
  assignRef,
  MenuListProvider,
  useMenuList,
  useMenuRoot,
  SubContextProvider,
  useSubContext,
  type MenuItemMeta,
  type MenuListContextValue,
  type MenuItemBaseProps,
  type SubContextValue,
  type MenuSubProps,
} from './menu-core'

/** Focus the surface node and highlight its first enabled item. Module-level
    so it can be invoked from an effect without the compiler tracing a direct
    setState into the effect body. */
function focusFirstItem(
  node: HTMLDivElement | null,
  enabledItems: () => MenuItemMeta[],
  setHighlightedId: (id: string | null) => void
) {
  if (!node) return
  node.focus?.({ preventScroll: true })
  const first = enabledItems()[0]
  if (first) setHighlightedId(first.id)
}

/* ------------------------------------------------------------------ */
/* MenuSurface — the rendered list element with keyboard handling. Used
   for root content panels and submenu content panels alike. */
/* ------------------------------------------------------------------ */

interface MenuSurfaceProps extends HTMLAttributes<HTMLDivElement> {
  /** ARIA role of the surface. Default 'menu'. */
  surfaceRole?: string
  isSubmenu?: boolean
  closeSelf?: () => void
  /** Called once the surface mounts, to focus first item etc. */
  onSurfaceRef?: (node: HTMLDivElement | null) => void
  children: ReactNode
}

export const MenuSurface = forwardRef<HTMLDivElement, MenuSurfaceProps>(function MenuSurface(
  { surfaceRole = 'menu', isSubmenu = false, closeSelf, onSurfaceRef, className, children, onKeyDown, ...rest },
  forwardedRef
) {
  const root = useMenuRoot('MenuSurface')
  const itemsRef = useRef<MenuItemMeta[]>([])
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const surfaceNodeRef = useRef<HTMLDivElement | null>(null)
  const typeaheadRef = useRef<{ query: string; timer: ReturnType<typeof setTimeout> | null }>({
    query: '',
    timer: null,
  })

  const register = useCallback((meta: MenuItemMeta) => {
    itemsRef.current = [...itemsRef.current, meta]
    return () => {
      itemsRef.current = itemsRef.current.filter((m) => m.id !== meta.id)
    }
  }, [])

  const orderedItems = useCallback(() => {
    const surface = surfaceNodeRef.current
    if (!surface) return itemsRef.current
    // Order by DOM position so registry order matches visual order.
    return [...itemsRef.current].sort((a, b) => {
      const an = a.getNode()
      const bn = b.getNode()
      if (!an || !bn) return 0
      const pos = an.compareDocumentPosition(bn)
      if (pos & Node.DOCUMENT_POSITION_FOLLOWING) return -1
      if (pos & Node.DOCUMENT_POSITION_PRECEDING) return 1
      return 0
    })
  }, [])

  const enabledItems = useCallback(() => orderedItems().filter((m) => !m.disabled), [orderedItems])

  // Focus the surface and highlight the first item on mount. Delegated to a
  // module-level helper so the React-Compiler doesn't trace a direct setState
  // into the effect body. Runs once per mount, after child items register.
  useEffect(() => {
    focusFirstItem(surfaceNodeRef.current, enabledItems, setHighlightedId)
    // Run once per surface mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const move = useCallback(
    (dir: 'next' | 'prev' | 'first' | 'last') => {
      const items = enabledItems()
      if (items.length === 0) return
      let nextId: string
      if (dir === 'first') nextId = items[0].id
      else if (dir === 'last') nextId = items[items.length - 1].id
      else {
        const idx = items.findIndex((m) => m.id === highlightedId)
        if (idx === -1) {
          nextId = dir === 'next' ? items[0].id : items[items.length - 1].id
        } else {
          const delta = dir === 'next' ? 1 : -1
          const nextIdx = (idx + delta + items.length) % items.length
          nextId = items[nextIdx].id
        }
      }
      setHighlightedId(nextId)
      const node = items.find((m) => m.id === nextId)?.getNode()
      node?.scrollIntoView?.({ block: 'nearest' })
    },
    [enabledItems, highlightedId]
  )

  const activateHighlighted = useCallback(() => {
    const item = itemsRef.current.find((m) => m.id === highlightedId)
    if (!item || item.disabled) return
    item.onActivate()
  }, [highlightedId])

  const typeahead = useCallback(
    (char: string) => {
      const state = typeaheadRef.current
      if (state.timer) clearTimeout(state.timer)
      state.query += char.toLowerCase()
      const query = state.query
      state.timer = setTimeout(() => {
        state.query = ''
        state.timer = null
      }, 500)

      const items = enabledItems()
      if (items.length === 0) return
      const startIdx = Math.max(
        0,
        items.findIndex((m) => m.id === highlightedId)
      )
      const ordered = [
        ...items.slice(startIdx + (query.length === 1 ? 1 : 0)),
        ...items.slice(0, startIdx + (query.length === 1 ? 1 : 0)),
      ]
      const match = ordered.find((m) => {
        const text = (m.getNode()?.textContent ?? '').trim().toLowerCase()
        return text.startsWith(query)
      })
      if (match) {
        setHighlightedId(match.id)
        match.getNode()?.scrollIntoView?.({ block: 'nearest' })
      }
    },
    [enabledItems, highlightedId]
  )

  // Clean up the typeahead timer.
  useEffect(() => {
    const state = typeaheadRef.current
    return () => {
      if (state.timer) clearTimeout(state.timer)
    }
  }, [])

  const listValue = useMemo<MenuListContextValue>(
    () => ({
      register,
      highlightedId,
      setHighlightedId,
      move,
      activateHighlighted,
      isSubmenu,
      closeAll: () => {
        root.setOpen(false)
        root.focusTrigger()
      },
      closeSelf,
    }),
    [register, highlightedId, move, activateHighlighted, isSubmenu, root, closeSelf]
  )

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          move('next')
          break
        case 'ArrowUp':
          e.preventDefault()
          move('prev')
          break
        case 'Home':
          e.preventDefault()
          move('first')
          break
        case 'End':
          e.preventDefault()
          move('last')
          break
        case 'ArrowRight': {
          const item = itemsRef.current.find((m) => m.id === highlightedId)
          if (item?.isSubTrigger && !item.disabled) {
            e.preventDefault()
            e.stopPropagation()
            item.openSub?.()
          }
          break
        }
        case 'ArrowLeft':
          if (isSubmenu && closeSelf) {
            e.preventDefault()
            e.stopPropagation()
            closeSelf()
          }
          break
        case 'Enter':
        case ' ':
          e.preventDefault()
          activateHighlighted()
          break
        case 'Escape':
          // useDismiss on the root handles full close; for submenus close self.
          if (isSubmenu && closeSelf) {
            e.preventDefault()
            e.stopPropagation()
            closeSelf()
          }
          break
        case 'Tab':
          // Tab closes the whole menu.
          root.setOpen(false)
          break
        default:
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            typeahead(e.key)
          }
      }
    },
    [onKeyDown, move, highlightedId, isSubmenu, closeSelf, activateHighlighted, root, typeahead]
  )

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      surfaceNodeRef.current = node
      onSurfaceRef?.(node)
      assignRef(forwardedRef, node)
    },
    [onSurfaceRef, forwardedRef]
  )

  return (
    <MenuListProvider value={listValue}>
      <div
        ref={setNode}
        role={surfaceRole}
        tabIndex={-1}
        aria-activedescendant={highlightedId ?? undefined}
        className={cn(styles.content, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </MenuListProvider>
  )
})

/* ------------------------------------------------------------------ */
/* Item primitives — shared by all three families. */
/* ------------------------------------------------------------------ */

function useMenuItem({
  disabled = false,
  onActivate,
  isSubTrigger = false,
  openSub,
}: {
  disabled?: boolean
  /** Run the item's select logic. Return true to keep the menu open. */
  onActivate: () => boolean | void
  isSubTrigger?: boolean
  openSub?: () => void
}) {
  const list = useMenuList('MenuItem')
  const id = useId()
  const nodeRef = useRef<HTMLElement | null>(null)

  // Keep the latest activation closures + close handler available to the parent
  // registry. Written in an effect (not during render) to satisfy compiler rules.
  const onActivateRef = useRef(onActivate)
  const openSubRef = useRef(openSub)
  const closeAllRef = useRef(list.closeAll)
  useEffect(() => {
    onActivateRef.current = onActivate
    openSubRef.current = openSub
    closeAllRef.current = list.closeAll
  })

  // Run select logic; close the whole menu unless the item kept it open.
  const activate = useCallback(() => {
    const prevented = onActivateRef.current()
    if (!prevented) closeAllRef.current()
  }, [])

  useEffect(() => {
    return list.register({
      id,
      getNode: () => nodeRef.current,
      disabled,
      isSubTrigger,
      onActivate: activate,
      openSub: openSubRef.current ? () => openSubRef.current?.() : undefined,
    })
    // onActivate/openSub are read through refs to avoid re-registering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, disabled, isSubTrigger, list.register, activate])

  const highlighted = list.highlightedId === id
  return { id, nodeRef, highlighted, list, activate }
}

export const MenuItem = forwardRef<HTMLDivElement, MenuItemBaseProps>(function MenuItem(
  { disabled = false, inset = false, variant = 'default', onSelect, className, children, ...rest },
  forwardedRef
) {
  const onActivate = useCallback(() => {
    let prevented = false
    onSelect?.({ preventDefault: () => (prevented = true) })
    return prevented
  }, [onSelect])

  const { id, nodeRef, highlighted, list, activate } = useMenuItem({ disabled, onActivate })

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node
      assignRef(forwardedRef, node)
    },
    [nodeRef, forwardedRef]
  )

  return (
    <div
      ref={setNode}
      id={id}
      role="menuitem"
      tabIndex={-1}
      aria-disabled={disabled || undefined}
      data-highlighted={highlighted || undefined}
      data-disabled={disabled || undefined}
      className={cn(
        styles.item,
        inset && styles.inset,
        variant === 'danger' && styles.variantDanger,
        className
      )}
      onClick={(e) => {
        if (disabled) return
        rest.onClick?.(e as never)
        activate()
      }}
      onPointerEnter={() => {
        if (!disabled) list.setHighlightedId(id)
      }}
      onPointerMove={() => {
        if (!disabled && !highlighted) list.setHighlightedId(id)
      }}
      {...rest}
    >
      {inset ? null : <span className={styles.indicator} aria-hidden />}
      <span className={styles.itemText}>{children}</span>
    </div>
  )
})

export interface MenuCheckboxItemProps extends Omit<MenuItemBaseProps, 'variant'> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export const MenuCheckboxItem = forwardRef<HTMLDivElement, MenuCheckboxItemProps>(
  function MenuCheckboxItem(
    { checked = false, onCheckedChange, disabled = false, inset = false, onSelect, className, children, ...rest },
    forwardedRef
  ) {
    const onActivate = useCallback(() => {
      let prevented = false
      onSelect?.({ preventDefault: () => (prevented = true) })
      onCheckedChange?.(!checked)
      // Checkbox items keep the menu open by convention only if onSelect prevents.
      return prevented
    }, [onSelect, onCheckedChange, checked])

    const { id, nodeRef, highlighted, list, activate } = useMenuItem({ disabled, onActivate })

    const setNode = useCallback(
      (node: HTMLDivElement | null) => {
        nodeRef.current = node
        assignRef(forwardedRef, node)
      },
      [nodeRef, forwardedRef]
    )

    return (
      <div
        ref={setNode}
        id={id}
        role="menuitemcheckbox"
        tabIndex={-1}
        aria-checked={checked}
        aria-disabled={disabled || undefined}
        data-highlighted={highlighted || undefined}
        data-disabled={disabled || undefined}
        className={cn(styles.item, inset && styles.inset, className)}
        onClick={(e) => {
          if (disabled) return
          rest.onClick?.(e as never)
          activate()
        }}
        onPointerEnter={() => {
          if (!disabled) list.setHighlightedId(id)
        }}
        {...rest}
      >
        <span className={styles.indicator} aria-hidden>
          {checked && <Check size={15} strokeWidth={2} />}
        </span>
        <span className={styles.itemText}>{children}</span>
      </div>
    )
  }
)

/* Radio group / radio item */

interface MenuRadioGroupContextValue {
  value: string | undefined
  setValue: (value: string) => void
}
const MenuRadioGroupContext = createContext<MenuRadioGroupContextValue | null>(null)

export interface MenuRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string
  onValueChange?: (value: string) => void
}

export const MenuRadioGroup = forwardRef<HTMLDivElement, MenuRadioGroupProps>(function MenuRadioGroup(
  { value, onValueChange, children, ...rest },
  forwardedRef
) {
  const setValue = useCallback(
    (next: string) => {
      onValueChange?.(next)
    },
    [onValueChange]
  )
  const ctx = useMemo(() => ({ value, setValue }), [value, setValue])
  return (
    <MenuRadioGroupContext.Provider value={ctx}>
      <div ref={forwardedRef} role="group" {...rest}>
        {children}
      </div>
    </MenuRadioGroupContext.Provider>
  )
})

export interface MenuRadioItemProps extends Omit<MenuItemBaseProps, 'variant' | 'onSelect'> {
  value: string
  onSelect?: (event: { preventDefault: () => void }) => void
}

export const MenuRadioItem = forwardRef<HTMLDivElement, MenuRadioItemProps>(function MenuRadioItem(
  { value, disabled = false, inset = false, onSelect, className, children, ...rest },
  forwardedRef
) {
  const group = useContext(MenuRadioGroupContext)
  if (!group) throw new Error('<MenuRadioItem> must be used within a radio group')
  const checked = group.value === value

  const onActivate = useCallback(() => {
    let prevented = false
    onSelect?.({ preventDefault: () => (prevented = true) })
    group.setValue(value)
    return prevented
  }, [onSelect, group, value])

  const { id, nodeRef, highlighted, list, activate } = useMenuItem({ disabled, onActivate })

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node
      assignRef(forwardedRef, node)
    },
    [nodeRef, forwardedRef]
  )

  return (
    <div
      ref={setNode}
      id={id}
      role="menuitemradio"
      tabIndex={-1}
      aria-checked={checked}
      aria-disabled={disabled || undefined}
      data-highlighted={highlighted || undefined}
      data-disabled={disabled || undefined}
      className={cn(styles.item, inset && styles.inset, className)}
      onClick={(e) => {
        if (disabled) return
        rest.onClick?.(e as never)
        activate()
      }}
      onPointerEnter={() => {
        if (!disabled) list.setHighlightedId(id)
      }}
      {...rest}
    >
      <span className={styles.indicator} aria-hidden>
        {checked && <Circle size={7} fill="currentColor" strokeWidth={0} />}
      </span>
      <span className={styles.itemText}>{children}</span>
    </div>
  )
})

/* Label / Separator / Shortcut / Group */

export interface MenuLabelProps extends HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}
export const MenuLabel = forwardRef<HTMLDivElement, MenuLabelProps>(function MenuLabel(
  { inset = false, className, ...rest },
  ref
) {
  return <div ref={ref} className={cn(styles.label, inset && styles.inset, className)} {...rest} />
})

export const MenuSeparator = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  function MenuSeparator({ className, ...rest }, ref) {
    return <div ref={ref} role="separator" aria-orientation="horizontal" className={cn(styles.separator, className)} {...rest} />
  }
)

export const MenuShortcut = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  function MenuShortcut({ className, ...rest }, ref) {
    return <span ref={ref} className={cn(styles.shortcut, className)} {...rest} />
  }
)

export const MenuGroup = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(function MenuGroup(
  { className, ...rest },
  ref
) {
  return <div ref={ref} role="group" className={className} {...rest} />
})

/* ------------------------------------------------------------------ */
/* Submenu — a nested popover anchored to its trigger item. */
/* ------------------------------------------------------------------ */

export function MenuSub({ open, defaultOpen = false, onOpenChange, children }: MenuSubProps) {
  const [isOpen, setOpen] = useControllableState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })
  const triggerRef = useRef<HTMLElement | null>(null)
  const contentRef = useRef<HTMLElement | null>(null)
  const anchorRef = useRef<HTMLElement | null>(null)
  const id = useId()

  const registerTrigger = useCallback((node: HTMLElement | null) => {
    triggerRef.current = node
    anchorRef.current = node
  }, [])
  const registerContent = useCallback((node: HTMLElement | null) => {
    contentRef.current = node
  }, [])

  const ctx = useMemo<SubContextValue>(
    () => ({
      open: isOpen,
      setOpen,
      triggerRef,
      contentRef,
      anchorRef,
      registerTrigger,
      registerContent,
      contentId: `${id}-subcontent`,
    }),
    [isOpen, setOpen, id, registerTrigger, registerContent]
  )
  return <SubContextProvider value={ctx}>{children}</SubContextProvider>
}

export interface MenuSubTriggerProps extends Omit<MenuItemBaseProps, 'onSelect' | 'variant'> {
  children: ReactNode
}

export const MenuSubTrigger = forwardRef<HTMLDivElement, MenuSubTriggerProps>(function MenuSubTrigger(
  { disabled = false, inset = false, className, children, ...rest },
  forwardedRef
) {
  const sub = useSubContext('MenuSubTrigger')

  const openSub = useCallback(() => {
    sub.setOpen(true)
  }, [sub])

  const onActivate = useCallback(() => {
    sub.setOpen(true)
    // Opening a submenu must not close the menu tree.
    return true
  }, [sub])

  const { id, nodeRef, highlighted, list } = useMenuItem({
    disabled,
    onActivate,
    isSubTrigger: true,
    openSub,
  })

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      nodeRef.current = node
      sub.registerTrigger(node)
      assignRef(forwardedRef, node)
    },
    [nodeRef, sub, forwardedRef]
  )

  return (
    <div
      ref={setNode}
      id={id}
      role="menuitem"
      tabIndex={-1}
      aria-haspopup="menu"
      aria-expanded={sub.open}
      aria-controls={sub.open ? sub.contentId : undefined}
      aria-disabled={disabled || undefined}
      data-highlighted={highlighted || undefined}
      data-disabled={disabled || undefined}
      data-state={sub.open ? 'open' : 'closed'}
      className={cn(styles.item, inset && styles.inset, className)}
      onClick={(e) => {
        if (disabled) return
        rest.onClick?.(e as never)
        sub.setOpen((prev) => !prev)
      }}
      onPointerEnter={() => {
        if (disabled) return
        list.setHighlightedId(id)
        sub.setOpen(true)
      }}
      {...rest}
    >
      {inset ? null : <span className={styles.indicator} aria-hidden />}
      <span className={styles.itemText}>{children}</span>
      <span className={styles.subChevron} aria-hidden>
        <ChevronRight size={15} strokeWidth={2} />
      </span>
    </div>
  )
})

export interface MenuSubContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export const MenuSubContent = forwardRef<HTMLDivElement, MenuSubContentProps>(function MenuSubContent(
  { className, children, style, ...rest },
  forwardedRef
) {
  const sub = useSubContext('MenuSubContent')
  const { floatingRef, style: floatStyle, side } = useFloating({
    placement: 'right-start',
    offset: 2,
    open: sub.open,
    anchorRef: sub.anchorRef,
  })

  const closeSelf = useCallback(() => {
    sub.setOpen(false)
    sub.triggerRef.current?.focus?.()
  }, [sub])

  // Dismiss the submenu on outside press (but not when clicking its own trigger).
  useEffect(() => {
    if (!sub.open) return
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node
      if (sub.contentRef.current?.contains(target)) return
      if (sub.triggerRef.current?.contains(target)) return
      sub.setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown, true)
    return () => document.removeEventListener('pointerdown', onPointerDown, true)
  }, [sub])

  const setNode = useCallback(
    (node: HTMLDivElement | null) => {
      sub.registerContent(node)
      floatingRef.current = node
      assignRef(forwardedRef, node)
    },
    [sub, floatingRef, forwardedRef]
  )

  if (!sub.open) return null

  return createPortalSafe(
    <MenuSurface
      ref={setNode}
      id={sub.contentId}
      isSubmenu
      closeSelf={closeSelf}
      data-side={side}
      data-state="open"
      className={className}
      style={{ ...floatStyle, ...style }}
      {...rest}
    >
      {children}
    </MenuSurface>
  )
})

function createPortalSafe(node: ReactNode) {
  if (typeof document === 'undefined') return null
  return createPortal(node, document.body)
}
