import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from 'react'

export type Side = 'top' | 'right' | 'bottom' | 'left'
export type Align = 'start' | 'center' | 'end'
export type Placement = Side | `${Side}-${Align}`

export interface FloatingOptions {
  /** Preferred placement of the floating element relative to the anchor. */
  placement?: Placement
  /** Gap in px between anchor and floating element along the main axis. */
  offset?: number
  /** Flip to the opposite side when there is not enough room. */
  flip?: boolean
  /** Shift along the cross axis to stay within the viewport. */
  shift?: boolean
  /** Min distance in px from the viewport edge when flipping/shifting. */
  padding?: number
  /** Match the floating element's width to the anchor width. */
  matchWidth?: boolean
  /** Whether positioning is active (skip work when closed). */
  open?: boolean
  /** Use an externally-owned anchor ref instead of the internal one. */
  anchorRef?: RefObject<HTMLElement | null>
}

export interface FloatingState {
  x: number
  y: number
  placement: Placement
  side: Side
  align: Align
  /** Inline style to spread onto the floating element. */
  style: {
    position: 'fixed'
    top: number
    left: number
    minWidth?: number
  }
}

function parsePlacement(placement: Placement): { side: Side; align: Align } {
  const [side, align = 'center'] = placement.split('-') as [Side, Align?]
  return { side, align: align as Align }
}

const opposite: Record<Side, Side> = {
  top: 'bottom',
  bottom: 'top',
  left: 'right',
  right: 'left',
}

function computePosition(
  anchor: DOMRect,
  floating: { width: number; height: number },
  side: Side,
  align: Align,
  offset: number
): { x: number; y: number } {
  let x = 0
  let y = 0

  // Main axis
  switch (side) {
    case 'top':
      y = anchor.top - floating.height - offset
      break
    case 'bottom':
      y = anchor.bottom + offset
      break
    case 'left':
      x = anchor.left - floating.width - offset
      break
    case 'right':
      x = anchor.right + offset
      break
  }

  // Cross axis
  if (side === 'top' || side === 'bottom') {
    if (align === 'start') x = anchor.left
    else if (align === 'end') x = anchor.right - floating.width
    else x = anchor.left + anchor.width / 2 - floating.width / 2
  } else {
    if (align === 'start') y = anchor.top
    else if (align === 'end') y = anchor.bottom - floating.height
    else y = anchor.top + anchor.height / 2 - floating.height / 2
  }

  return { x, y }
}

/**
 * Lightweight floating-element positioner. Computes a fixed-position offset for
 * a floating element relative to an anchor, with optional flip and shift to
 * keep it inside the viewport. Recomputes on scroll, resize, and content size
 * changes. No external dependency — kept deliberately small to match the
 * system's "no heavy deps" stance.
 */
export function useFloating(options: FloatingOptions = {}) {
  const {
    placement = 'bottom',
    offset = 8,
    flip = true,
    shift = true,
    padding = 8,
    matchWidth = false,
    open = true,
    anchorRef: providedAnchorRef,
  } = options

  const internalAnchorRef = useRef<HTMLElement | null>(null)
  const anchorRef = providedAnchorRef ?? internalAnchorRef
  const floatingRef = useRef<HTMLElement | null>(null)
  const [state, setState] = useState<FloatingState | null>(null)

  const update = useCallback(() => {
    const anchor = anchorRef.current
    const floating = floatingRef.current
    if (!anchor || !floating) return

    const anchorRect = anchor.getBoundingClientRect()
    const floatRect = { width: floating.offsetWidth, height: floating.offsetHeight }
    const vw = document.documentElement.clientWidth
    const vh = document.documentElement.clientHeight

    const parsed = parsePlacement(placement)
    let side = parsed.side
    const align = parsed.align

    // Flip if there isn't room on the preferred side.
    if (flip) {
      const space = {
        top: anchorRect.top,
        bottom: vh - anchorRect.bottom,
        left: anchorRect.left,
        right: vw - anchorRect.right,
      }
      const need = side === 'top' || side === 'bottom' ? floatRect.height : floatRect.width
      if (space[side] < need + offset + padding && space[opposite[side]] > space[side]) {
        side = opposite[side]
      }
    }

    let { x, y } = computePosition(anchorRect, floatRect, side, align, offset)

    // Shift along the cross axis to remain within the viewport.
    if (shift) {
      if (side === 'top' || side === 'bottom') {
        const max = vw - floatRect.width - padding
        x = Math.min(Math.max(x, padding), Math.max(padding, max))
      } else {
        const max = vh - floatRect.height - padding
        y = Math.min(Math.max(y, padding), Math.max(padding, max))
      }
    }

    setState({
      x: Math.round(x),
      y: Math.round(y),
      placement: align === 'center' ? side : (`${side}-${align}` as Placement),
      side,
      align,
      style: {
        position: 'fixed',
        top: Math.round(y),
        left: Math.round(x),
        ...(matchWidth ? { minWidth: Math.round(anchorRect.width) } : {}),
      },
    })
    // anchorRef/floatingRef are stable refs and intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, offset, flip, shift, padding, matchWidth])

  useLayoutEffect(() => {
    if (!open) return
    update()

    const anchor = anchorRef.current
    const floating = floatingRef.current

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)

    let ro: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(update)
      if (anchor) ro.observe(anchor)
      if (floating) ro.observe(floating)
    }

    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
      ro?.disconnect()
    }
    // anchorRef/floatingRef are stable refs and intentionally excluded.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, update])

  return { anchorRef, floatingRef, ...((state ?? {}) as Partial<FloatingState>), update }
}
