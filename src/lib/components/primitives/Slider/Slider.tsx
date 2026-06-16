import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import styles from './Slider.module.css'

export type SliderOrientation = 'horizontal' | 'vertical'

export interface SliderProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'> {
  /** Controlled value. A number for a single thumb, an array for a range. */
  value?: number | number[]
  /** Initial value when uncontrolled. */
  defaultValue?: number | number[]
  /** Called with the next value (matching the single/array shape used). */
  onValueChange?: (value: number | number[]) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  orientation?: SliderOrientation
  'aria-label'?: string
  'aria-labelledby'?: string
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function roundToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value
  const steps = Math.round((value - min) / step)
  return min + steps * step
}

/** Snap, clamp, and fix floating-point dust from step arithmetic. */
function normalize(value: number, min: number, max: number, step: number): number {
  const snapped = roundToStep(clamp(value, min, max), min, step)
  const clamped = clamp(snapped, min, max)
  // Remove floating point noise (e.g. 0.30000000000000004).
  return Math.round(clamped * 1e6) / 1e6
}

export const Slider = forwardRef<HTMLDivElement, SliderProps>(function Slider(
  {
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    disabled = false,
    orientation = 'horizontal',
    className,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...rest
  },
  ref
) {
  // Detect whether the consumer is working in "range" (array) mode based on
  // whichever value prop was supplied.
  const sourceIsArray = Array.isArray(value) || Array.isArray(defaultValue)

  const toArray = useCallback(
    (v: number | number[] | undefined, fallback: number[]): number[] => {
      if (v === undefined) return fallback
      return Array.isArray(v) ? v : [v]
    },
    []
  )

  const [internalValues, setInternalValues] = useControllableState<number[]>({
    value: value === undefined ? undefined : toArray(value, []),
    defaultValue: toArray(defaultValue, [min]),
    onChange: (next) => {
      if (sourceIsArray) {
        onValueChange?.(next)
      } else {
        onValueChange?.(next[0] ?? min)
      }
    },
  })

  // Normalised, sorted copy used for rendering and geometry.
  const values = internalValues.map((v) => normalize(v, min, max, step))

  const trackRef = useRef<HTMLDivElement | null>(null)
  const thumbRefs = useRef<(HTMLSpanElement | null)[]>([])

  const registerThumb = useCallback((index: number, node: HTMLSpanElement | null) => {
    thumbRefs.current[index] = node
  }, [])

  const commitValueAt = useCallback(
    (index: number, nextRaw: number) => {
      setInternalValues((prev) => {
        const next = prev.slice()
        let candidate = normalize(nextRaw, min, max, step)
        // Thumbs cannot cross their neighbours.
        const lower = index > 0 ? next[index - 1] : min
        const upper = index < next.length - 1 ? next[index + 1] : max
        candidate = clamp(candidate, lower, upper)
        next[index] = candidate
        return next
      })
    },
    [setInternalValues, min, max, step]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLSpanElement>, index: number) => {
      if (disabled) return
      const current = values[index]
      const big = step * 10
      let next: number
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowUp':
          next = current + step
          break
        case 'ArrowLeft':
        case 'ArrowDown':
          next = current - step
          break
        case 'PageUp':
          next = current + big
          break
        case 'PageDown':
          next = current - big
          break
        case 'Home':
          next = min
          break
        case 'End':
          next = max
          break
        default:
          return
      }
      event.preventDefault()
      commitValueAt(index, next)
    },
    [disabled, values, step, min, max, commitValueAt]
  )

  // Translate a pointer position to a value along the track.
  const valueFromPointer = useCallback(
    (clientX: number, clientY: number): number => {
      const track = trackRef.current
      if (!track) return min
      const rect = track.getBoundingClientRect()
      let ratio: number
      if (orientation === 'vertical') {
        const height = rect.height || 1
        ratio = (rect.bottom - clientY) / height
      } else {
        const width = rect.width || 1
        ratio = (clientX - rect.left) / width
      }
      ratio = clamp(ratio, 0, 1)
      return min + ratio * (max - min)
    },
    [orientation, min, max]
  )

  const nearestThumb = useCallback(
    (targetValue: number): number => {
      let nearest = 0
      let bestDist = Infinity
      values.forEach((v, i) => {
        const dist = Math.abs(v - targetValue)
        if (dist < bestDist) {
          bestDist = dist
          nearest = i
        }
      })
      return nearest
    },
    [values]
  )

  const activeThumbRef = useRef<number | null>(null)

  const handleTrackPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return
      const targetValue = valueFromPointer(event.clientX, event.clientY)
      const index = nearestThumb(targetValue)
      activeThumbRef.current = index
      commitValueAt(index, targetValue)
      thumbRefs.current[index]?.focus()
      event.currentTarget.setPointerCapture?.(event.pointerId)
    },
    [disabled, valueFromPointer, nearestThumb, commitValueAt]
  )

  const handleTrackPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled) return
      const index = activeThumbRef.current
      if (index === null) return
      const targetValue = valueFromPointer(event.clientX, event.clientY)
      commitValueAt(index, targetValue)
    },
    [disabled, valueFromPointer, commitValueAt]
  )

  const handleTrackPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      activeThumbRef.current = null
      event.currentTarget.releasePointerCapture?.(event.pointerId)
    },
    []
  )

  const range = max - min || 1
  const percentOf = (v: number) => ((v - min) / range) * 100

  // Filled range: from 0% to the thumb for a single value, or between the two
  // outermost thumbs for a range slider.
  const minPercent = values.length > 1 ? percentOf(Math.min(...values)) : 0
  const maxPercent = percentOf(Math.max(...values))

  const isVertical = orientation === 'vertical'

  const rangeStyle = isVertical
    ? { bottom: `${minPercent}%`, height: `${maxPercent - minPercent}%` }
    : { left: `${minPercent}%`, width: `${maxPercent - minPercent}%` }

  return (
    <div
      ref={ref}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      className={cn(
        styles.root,
        styles[`orientation-${orientation}`],
        disabled && styles.disabled,
        className
      )}
      {...rest}
    >
      <div
        ref={trackRef}
        className={styles.track}
        onPointerDown={handleTrackPointerDown}
        onPointerMove={handleTrackPointerMove}
        onPointerUp={handleTrackPointerUp}
      >
        <div className={styles.range} style={rangeStyle} />
        {values.map((v, index) => {
          const pos = percentOf(v)
          const thumbStyle = isVertical ? { bottom: `${pos}%` } : { left: `${pos}%` }
          return (
            <span
              key={index}
              ref={(node) => registerThumb(index, node)}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={min}
              aria-valuemax={max}
              aria-valuenow={v}
              aria-orientation={orientation}
              aria-disabled={disabled || undefined}
              aria-label={ariaLabel}
              aria-labelledby={ariaLabelledby}
              className={styles.thumb}
              style={thumbStyle}
              onKeyDown={(event) => handleKeyDown(event, index)}
            />
          )
        })}
      </div>
    </div>
  )
})
