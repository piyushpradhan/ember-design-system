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
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from 'react'
import { GripVertical } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Resizable.module.css'

export type ResizableDirection = 'horizontal' | 'vertical'

interface PanelConstraints {
  id: string
  defaultSize?: number
  minSize: number
  maxSize: number
}

interface ResizableContextValue {
  direction: ResizableDirection
  groupRef: React.RefObject<HTMLDivElement | null>
  /** Ordered list of registered panel ids. */
  order: string[]
  sizes: Record<string, number>
  registerPanel: (panel: PanelConstraints) => void
  unregisterPanel: (id: string) => void
  getSize: (id: string) => number
  getConstraints: (id: string) => PanelConstraints | undefined
  /** Resize the pair of panels straddling the handle at `handleIndex`. */
  resizeAt: (handleIndex: number, deltaPercent: number) => void
  /** Ordered list of registered handle ids (mount order = DOM order). */
  handleOrder: string[]
  registerHandle: (id: string) => void
  unregisterHandle: (id: string) => void
}

const ResizableContext = createContext<ResizableContextValue | null>(null)

function useResizableContext(component: string) {
  const ctx = useContext(ResizableContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <ResizablePanelGroup>`)
  }
  return ctx
}

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

export interface ResizablePanelGroupProps extends HTMLAttributes<HTMLDivElement> {
  direction: ResizableDirection
  children: ReactNode
}

export const ResizablePanelGroup = forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  function ResizablePanelGroup({ direction, className, children, ...rest }, forwardedRef) {
    const groupRef = useRef<HTMLDivElement | null>(null)
    const constraintsRef = useRef<Map<string, PanelConstraints>>(new Map())
    const [order, setOrder] = useState<string[]>([])
    const [sizes, setSizes] = useState<Record<string, number>>({})

    const distribute = useCallback(() => {
      const ids = Array.from(constraintsRef.current.keys())
      setOrder(ids)
      setSizes((prev) => {
        const next: Record<string, number> = {}
        let assigned = 0
        const unsized: string[] = []
        for (const id of ids) {
          const c = constraintsRef.current.get(id)!
          if (prev[id] !== undefined) {
            next[id] = prev[id]
            assigned += prev[id]
          } else if (c.defaultSize !== undefined) {
            next[id] = c.defaultSize
            assigned += c.defaultSize
          } else {
            unsized.push(id)
          }
        }
        // Spread the remaining space across panels without an explicit size.
        if (unsized.length > 0) {
          const remaining = Math.max(100 - assigned, 0)
          const each = remaining / unsized.length
          for (const id of unsized) next[id] = each
        }
        return next
      })
    }, [])

    const registerPanel = useCallback(
      (panel: PanelConstraints) => {
        constraintsRef.current.set(panel.id, panel)
        distribute()
      },
      [distribute]
    )

    const unregisterPanel = useCallback(
      (id: string) => {
        constraintsRef.current.delete(id)
        setSizes((prev) => {
          if (prev[id] === undefined) return prev
          const next = { ...prev }
          delete next[id]
          return next
        })
        setOrder(Array.from(constraintsRef.current.keys()))
      },
      []
    )

    const getSize = useCallback((id: string) => sizes[id] ?? 0, [sizes])
    const getConstraints = useCallback(
      (id: string) => constraintsRef.current.get(id),
      []
    )

    const resizeAt = useCallback((handleIndex: number, deltaPercent: number) => {
      setSizes((prev) => {
        const ids = Array.from(constraintsRef.current.keys())
        const beforeId = ids[handleIndex]
        const afterId = ids[handleIndex + 1]
        if (!beforeId || !afterId) return prev
        const beforeC = constraintsRef.current.get(beforeId)!
        const afterC = constraintsRef.current.get(afterId)!
        const beforeSize = prev[beforeId] ?? 0
        const afterSize = prev[afterId] ?? 0

        let nextBefore = beforeSize + deltaPercent
        nextBefore = clamp(nextBefore, beforeC.minSize, beforeC.maxSize)
        // Keep the pair's combined size constant so other panels are unaffected.
        let nextAfter = beforeSize + afterSize - nextBefore
        nextAfter = clamp(nextAfter, afterC.minSize, afterC.maxSize)
        // Re-derive `before` after clamping `after` so both constraints hold.
        nextBefore = beforeSize + afterSize - nextAfter

        if (nextBefore === beforeSize && nextAfter === afterSize) return prev
        return { ...prev, [beforeId]: nextBefore, [afterId]: nextAfter }
      })
    }, [])

    // Handles register in mount order, which matches their left-to-right /
    // top-to-bottom DOM order, giving each handle a stable ordinal index.
    const handlesRef = useRef<string[]>([])
    const [handleOrder, setHandleOrder] = useState<string[]>([])

    const registerHandle = useCallback((id: string) => {
      if (handlesRef.current.includes(id)) return
      handlesRef.current = [...handlesRef.current, id]
      setHandleOrder(handlesRef.current)
    }, [])

    const unregisterHandle = useCallback((id: string) => {
      if (!handlesRef.current.includes(id)) return
      handlesRef.current = handlesRef.current.filter((h) => h !== id)
      setHandleOrder(handlesRef.current)
    }, [])

    const setGroupNode = useCallback(
      (node: HTMLDivElement | null) => {
        groupRef.current = node
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [forwardedRef]
    )

    const value = useMemo<ResizableContextValue>(
      () => ({
        direction,
        groupRef,
        order,
        sizes,
        registerPanel,
        unregisterPanel,
        getSize,
        getConstraints,
        resizeAt,
        handleOrder,
        registerHandle,
        unregisterHandle,
      }),
      [
        direction,
        order,
        sizes,
        registerPanel,
        unregisterPanel,
        getSize,
        getConstraints,
        resizeAt,
        handleOrder,
        registerHandle,
        unregisterHandle,
      ]
    )

    return (
      <ResizableContext.Provider value={value}>
        <div
          ref={setGroupNode}
          className={cn(styles.group, styles[`dir-${direction}`], className)}
          data-direction={direction}
          {...rest}
        >
          {children}
        </div>
      </ResizableContext.Provider>
    )
  }
)

export interface ResizablePanelProps extends HTMLAttributes<HTMLDivElement> {
  /** Initial size as a percentage (0-100) of the group. */
  defaultSize?: number
  /** Minimum size as a percentage. Default 0. */
  minSize?: number
  /** Maximum size as a percentage. Default 100. */
  maxSize?: number
  children?: ReactNode
}

export const ResizablePanel = forwardRef<HTMLDivElement, ResizablePanelProps>(
  function ResizablePanel(
    { defaultSize, minSize = 0, maxSize = 100, className, style, children, ...rest },
    ref
  ) {
    const ctx = useResizableContext('ResizablePanel')
    const id = useId()
    const { registerPanel, unregisterPanel } = ctx

    // Register on mount / when constraints change; clean up on unmount.
    useEffect(() => {
      registerPanel({ id, defaultSize, minSize, maxSize })
      return () => unregisterPanel(id)
    }, [id, defaultSize, minSize, maxSize, registerPanel, unregisterPanel])

    const size = ctx.getSize(id)

    return (
      <div
        ref={ref}
        data-panel-id={id}
        className={cn(styles.panel, className)}
        style={{ flexBasis: `${size}%`, ...style }}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

export interface ResizableHandleProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onKeyDown'> {
  /** Renders a grip affordance dot in the center of the handle. */
  withHandle?: boolean
  /** Percentage step applied per arrow key press. Default 5. */
  keyboardStep?: number
}

export const ResizableHandle = forwardRef<HTMLDivElement, ResizableHandleProps>(
  function ResizableHandle({ withHandle = false, keyboardStep = 5, className, ...rest }, ref) {
    const ctx = useResizableContext('ResizableHandle')
    const id = useId()
    const handleRef = useRef<HTMLDivElement | null>(null)
    const dragState = useRef<{ pointerId: number; index: number } | null>(null)

    const { registerHandle, unregisterHandle } = ctx
    useEffect(() => {
      registerHandle(id)
      return () => unregisterHandle(id)
    }, [id, registerHandle, unregisterHandle])

    // This handle's ordinal position — it straddles panel[index] and panel[index+1].
    const index = ctx.handleOrder.indexOf(id)

    const setHandleNode = useCallback(
      (node: HTMLDivElement | null) => {
        handleRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ref]
    )

    const onPointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        if (index < 0) return
        e.preventDefault()
        dragState.current = { pointerId: e.pointerId, index }
        handleRef.current?.setPointerCapture?.(e.pointerId)

        const move = (ev: globalThis.PointerEvent) => {
          const state = dragState.current
          const group = ctx.groupRef.current
          if (!state || !group) return
          const rect = group.getBoundingClientRect()
          const span = ctx.direction === 'horizontal' ? rect.width : rect.height
          if (span <= 0) return
          const movement = ctx.direction === 'horizontal' ? ev.movementX : ev.movementY
          const deltaPercent = (movement / span) * 100
          if (deltaPercent !== 0) ctx.resizeAt(state.index, deltaPercent)
        }
        const end = () => {
          const node = handleRef.current
          const state = dragState.current
          if (node && state && node.hasPointerCapture?.(state.pointerId)) {
            node.releasePointerCapture(state.pointerId)
          }
          dragState.current = null
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', end)
          window.removeEventListener('pointercancel', end)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', end)
        window.addEventListener('pointercancel', end)
      },
      [index, ctx]
    )

    const onKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (index < 0) return
        const horizontal = ctx.direction === 'horizontal'
        const decreaseKey = horizontal ? 'ArrowLeft' : 'ArrowUp'
        const increaseKey = horizontal ? 'ArrowRight' : 'ArrowDown'

        const ids = ctx.order
        const beforeId = ids[index]
        const c = beforeId ? ctx.getConstraints(beforeId) : undefined

        if (e.key === decreaseKey) {
          e.preventDefault()
          ctx.resizeAt(index, -keyboardStep)
        } else if (e.key === increaseKey) {
          e.preventDefault()
          ctx.resizeAt(index, keyboardStep)
        } else if (e.key === 'Home' && c) {
          e.preventDefault()
          ctx.resizeAt(index, -100)
        } else if (e.key === 'End' && c) {
          e.preventDefault()
          ctx.resizeAt(index, 100)
        }
      },
      [ctx, index, keyboardStep]
    )

    // ARIA values describe the panel immediately preceding the handle.
    const beforeId = index >= 0 ? ctx.order[index] : undefined
    const constraints = beforeId ? ctx.getConstraints(beforeId) : undefined
    const valueNow = beforeId ? Math.round(ctx.getSize(beforeId)) : undefined

    return (
      <div
        ref={setHandleNode}
        role="separator"
        aria-orientation={ctx.direction === 'horizontal' ? 'vertical' : 'horizontal'}
        aria-valuenow={valueNow}
        aria-valuemin={constraints ? Math.round(constraints.minSize) : undefined}
        aria-valuemax={constraints ? Math.round(constraints.maxSize) : undefined}
        tabIndex={0}
        className={cn(styles.handle, styles[`handle-${ctx.direction}`], className)}
        data-direction={ctx.direction}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
        {...rest}
      >
        {withHandle && (
          <span className={styles.grip} aria-hidden>
            <GripVertical size={14} strokeWidth={1.5} />
          </span>
        )}
      </div>
    )
  }
)
