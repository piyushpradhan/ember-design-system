import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react'
import { createPortal } from 'react-dom'
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
  type MenuItemBaseProps,
  type MenuCheckboxItemProps,
  type MenuRadioGroupProps,
  type MenuRadioItemProps,
  type MenuLabelProps,
  type MenuSubProps,
  type MenuSubTriggerProps,
  type MenuSubContentProps,
} from '../_menu'

export interface DropdownMenuProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function DropdownMenu({ open, defaultOpen, onOpenChange, children }: DropdownMenuProps) {
  const root = useMenuRootState({ open, defaultOpen, onOpenChange })
  return <MenuRootProvider value={root}>{children}</MenuRootProvider>
}

type TriggerChildProps = {
  ref?: Ref<HTMLElement>
  onClick?: (e: React.MouseEvent) => void
  onKeyDown?: (e: React.KeyboardEvent) => void
  'aria-haspopup'?: string
  'aria-expanded'?: boolean
  'aria-controls'?: string
  id?: string
}

export interface DropdownMenuTriggerProps {
  children: ReactElement<TriggerChildProps>
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const root = useMenuRoot('DropdownMenuTrigger')
  if (!isValidElement(children)) {
    throw new Error('<DropdownMenuTrigger> expects a single React element child')
  }
  const childProps = children.props
  return cloneElement(children, {
    ref: (node: HTMLElement | null) => {
      root.registerTrigger(node)
      root.registerAnchor(node)
      assignRef(childProps.ref, node)
    },
    id: childProps.id ?? root.triggerId,
    'aria-haspopup': 'menu',
    'aria-expanded': root.open,
    'aria-controls': root.open ? root.contentId : undefined,
    onClick: (e: React.MouseEvent) => {
      childProps.onClick?.(e)
      root.setOpen((prev) => !prev)
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      childProps.onKeyDown?.(e)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        root.setOpen(true)
      }
    },
  } as Partial<TriggerChildProps>)
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  /** Preferred side. Default 'bottom'. */
  placement?: Side
  /** Alignment along the side. Default 'start'. */
  align?: Align
  offset?: number
  /** Render into a portal. Default true. */
  portal?: boolean
}

export const DropdownMenuContent = forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { placement = 'bottom', align = 'start', offset = 6, portal = true, style, children, ...rest },
    forwardedRef
  ) {
    const root = useMenuRoot('DropdownMenuContent')
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

    // Restore focus to the trigger when the menu closes.
    useEffect(() => {
      if (!root.open) return
      return () => {
        // focus restoration handled by explicit dismiss; nothing here.
      }
    }, [root.open])

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
export const DropdownMenuItem = MenuItem
export const DropdownMenuCheckboxItem = MenuCheckboxItem
export const DropdownMenuRadioGroup = MenuRadioGroup
export const DropdownMenuRadioItem = MenuRadioItem
export const DropdownMenuLabel = MenuLabel
export const DropdownMenuSeparator = MenuSeparator
export const DropdownMenuShortcut = MenuShortcut
export const DropdownMenuGroup = MenuGroup
export const DropdownMenuSub = MenuSub
export const DropdownMenuSubTrigger = MenuSubTrigger
export const DropdownMenuSubContent = MenuSubContent

export type DropdownMenuItemProps = MenuItemBaseProps
export type DropdownMenuCheckboxItemProps = MenuCheckboxItemProps
export type DropdownMenuRadioGroupProps = MenuRadioGroupProps
export type DropdownMenuRadioItemProps = MenuRadioItemProps
export type DropdownMenuLabelProps = MenuLabelProps
export type DropdownMenuSubProps = MenuSubProps
export type DropdownMenuSubTriggerProps = MenuSubTriggerProps
export type DropdownMenuSubContentProps = MenuSubContentProps
