import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Kbd.module.css'

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md'
  icon?: ReactNode
}

export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd(
  { size = 'md', icon, className, children, ...rest },
  ref
) {
  return (
    <kbd
      ref={ref}
      className={cn(styles.kbd, styles[`size-${size}`], className)}
      {...rest}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </kbd>
  )
})

export interface KbdGroupProps extends HTMLAttributes<HTMLDivElement> {
  separator?: ReactNode
}

export function KbdGroup({ separator = '+', className, children, ...rest }: KbdGroupProps) {
  const nodes = Array.isArray(children) ? children : [children]
  return (
    <div className={cn(styles.group, className)} {...rest}>
      {nodes.map((child, i) => (
        <span key={i} className={styles.item}>
          {i > 0 && <span className={styles.sep}>{separator}</span>}
          {child}
        </span>
      ))}
    </div>
  )
}
