import { useEffect, type RefObject } from 'react'

export interface DismissOptions {
  enabled: boolean
  onDismiss: () => void
  /** Elements that should NOT count as "outside" (e.g. trigger + content). */
  refs: Array<RefObject<HTMLElement | null>>
  /** Dismiss when Escape is pressed. Default: true. */
  escapeKey?: boolean
  /** Dismiss on outside pointer press. Default: true. */
  outsidePress?: boolean
}

/**
 * Closes a floating layer on Escape or on a pointer press outside the provided
 * element refs. Shared by Popover, Dropdown Menu, Combobox, Hover Card, etc.
 */
export function useDismiss({
  enabled,
  onDismiss,
  refs,
  escapeKey = true,
  outsidePress = true,
}: DismissOptions) {
  useEffect(() => {
    if (!enabled) return

    const isInside = (target: Node) =>
      refs.some((ref) => ref.current?.contains(target))

    const onPointerDown = (e: PointerEvent) => {
      if (!outsidePress) return
      if (isInside(e.target as Node)) return
      onDismiss()
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (escapeKey && e.key === 'Escape') {
        e.stopPropagation()
        onDismiss()
      }
    }

    document.addEventListener('pointerdown', onPointerDown, true)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown, true)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [enabled, onDismiss, refs, escapeKey, outsidePress])
}
