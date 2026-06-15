import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Progress.module.css'

export type ProgressSize = 'sm' | 'md'

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  /** Current value, clamped to 0..max. Ignored when `indeterminate`. */
  value?: number
  /** Upper bound of the scale. */
  max?: number
  /** Render a looping animation with no known value. */
  indeterminate?: boolean
  size?: ProgressSize
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min
  return Math.min(max, Math.max(min, value))
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  {
    value = 0,
    max = 100,
    indeterminate = false,
    size = 'md',
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  },
  ref
) {
  const safeMax = max > 0 ? max : 100
  const clamped = clamp(value, 0, safeMax)
  const percent = indeterminate ? 0 : (clamped / safeMax) * 100

  const trackStyle: CSSProperties = {
    '--progress-percent': `${percent}%`,
    ...style,
  } as CSSProperties

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={indeterminate ? undefined : clamped}
      className={cn(
        styles.track,
        styles[`size-${size}`],
        indeterminate && styles.indeterminate,
        className
      )}
      style={trackStyle}
      {...rest}
    >
      <div className={styles.fill} />
    </div>
  )
})
