import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import { tokenVars } from '../../../utils/space'
import styles from './Dot.module.css'

export type DotTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
export type DotSize = 'xs' | 'sm' | 'md'

export interface DotProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: DotTone
  size?: DotSize
  /** Pulsing animation for "live"/"working" states. */
  pulse?: boolean
  /** Soft halo ring around the dot. */
  ring?: boolean
  /** Override colour with an explicit CSS colour value. */
  color?: string
}

export const Dot = forwardRef<HTMLSpanElement, DotProps>(function Dot(
  { tone = 'neutral', size = 'sm', pulse = false, ring = false, color, className, style, ...rest },
  ref
) {
  const vars = tokenVars({ '--dot-color': color })
  return (
    <span
      ref={ref}
      aria-hidden
      className={cn(
        styles.dot,
        styles[`tone-${tone}`],
        styles[`size-${size}`],
        pulse && styles.pulse,
        ring && styles.ring,
        color && styles.custom,
        className
      )}
      style={{ ...vars, ...style } as CSSProperties}
      {...rest}
    />
  )
})
