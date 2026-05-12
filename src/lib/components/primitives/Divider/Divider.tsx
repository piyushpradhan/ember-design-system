import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Divider.module.css'

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical'
  variant?: 'solid' | 'dashed'
  label?: ReactNode
}

export function Divider({ orientation = 'horizontal', variant = 'solid', label, className, ...rest }: DividerProps) {
  if (label && orientation === 'horizontal') {
    return (
      <div className={cn(styles.labelled, className)} role="separator" {...rest}>
        <span className={cn(styles.line, styles[`variant-${variant}`])} />
        <span className={styles.labelText}>{label}</span>
        <span className={cn(styles.line, styles[`variant-${variant}`])} />
      </div>
    )
  }
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(styles.divider, styles[`orient-${orientation}`], styles[`variant-${variant}`], className)}
      {...rest}
    />
  )
}
