import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Badge.module.css'

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'info'
export type BadgeVariant = 'solid' | 'subtle' | 'outline'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  icon?: ReactNode
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone = 'neutral', variant = 'subtle', size = 'md', icon, className, children, ...rest },
  ref
) {
  return (
    <span
      ref={ref}
      className={cn(styles.badge, styles[`tone-${tone}`], styles[`variant-${variant}`], styles[`size-${size}`], className)}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </span>
  )
})
