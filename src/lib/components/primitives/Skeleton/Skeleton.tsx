import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Skeleton.module.css'

export type SkeletonVariant = 'text' | 'circle' | 'rect'

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant
  /** number → px, string → used as-is (e.g. '100%'). */
  width?: number | string
  /** number → px, string → used as-is. */
  height?: number | string
  /** Border radius override; number → px, string → used as-is. */
  radius?: number | string
}

function toSize(value: number | string | undefined): string | undefined {
  if (value === undefined) return undefined
  return typeof value === 'number' ? `${value}px` : value
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(function Skeleton(
  { variant = 'rect', width, height, radius, className, style, ...rest },
  ref
) {
  const dimStyle: CSSProperties = {
    width: toSize(width),
    height: toSize(height),
    borderRadius: toSize(radius),
    ...style,
  }

  return (
    <div
      ref={ref}
      role="presentation"
      aria-hidden
      className={cn(styles.skeleton, styles[`variant-${variant}`], className)}
      style={dimStyle}
      {...rest}
    />
  )
})
