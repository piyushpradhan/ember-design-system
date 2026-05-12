import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './EmptyState.module.css'

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  icon?: ReactNode
  title: ReactNode
  description?: ReactNode
  actions?: ReactNode
}

export function EmptyState({ icon, title, description, actions, className, ...rest }: EmptyStateProps) {
  return (
    <div className={cn(styles.wrap, className)} {...rest}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <h3 className={styles.title}>{title}</h3>
      {description && <p className={styles.description}>{description}</p>}
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
