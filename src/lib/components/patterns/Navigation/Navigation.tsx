import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Navigation.module.css'

export interface NavItem {
  label: string
  href?: string
  active?: boolean
  icon?: ReactNode
  onClick?: () => void
}

export interface TopNavProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode
  items: NavItem[]
  actions?: ReactNode
}

export function TopNav({ brand, items, actions, className, ...rest }: TopNavProps) {
  return (
    <nav className={cn(styles.top, className)} {...rest}>
      <div className={styles.brand}>{brand}</div>
      <ul className={styles.topItems}>
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href ?? '#'}
              onClick={(e) => {
                if (it.onClick) {
                  e.preventDefault()
                  it.onClick()
                }
              }}
              aria-current={it.active ? 'page' : undefined}
              className={cn(styles.topItem, it.active && styles.topItemActive)}
            >
              {it.icon}
              {it.label}
            </a>
          </li>
        ))}
      </ul>
      {actions && <div className={styles.actions}>{actions}</div>}
    </nav>
  )
}

export interface SideNavProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  items: NavItem[]
  title?: ReactNode
}

export function SideNav({ items, title, className, ...rest }: SideNavProps) {
  return (
    <nav className={cn(styles.side, className)} {...rest}>
      {title && <div className={styles.sideTitle}>{title}</div>}
      <ul className={styles.sideItems}>
        {items.map((it) => (
          <li key={it.label}>
            <a
              href={it.href ?? '#'}
              onClick={(e) => {
                if (it.onClick) {
                  e.preventDefault()
                  it.onClick()
                }
              }}
              aria-current={it.active ? 'page' : undefined}
              className={cn(styles.sideItem, it.active && styles.sideItemActive)}
            >
              {it.icon && <span className={styles.sideIcon}>{it.icon}</span>}
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
