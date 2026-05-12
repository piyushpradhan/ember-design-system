import { Fragment, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronRight } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Breadcrumb.module.css'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  separator?: ReactNode
}

export function Breadcrumb({ items, separator, className, ...rest }: BreadcrumbProps) {
  const sep = separator ?? <ChevronRight size={12} aria-hidden />
  return (
    <nav aria-label="Breadcrumb" className={cn(styles.nav, className)} {...rest}>
      <ol className={styles.list}>
        {items.map((it, i) => {
          const last = i === items.length - 1
          return (
            <Fragment key={i}>
              <li className={styles.item}>
                {last || !it.href ? (
                  <span aria-current={last ? 'page' : undefined} className={cn(last && styles.current)}>
                    {it.label}
                  </span>
                ) : (
                  <a href={it.href} className={styles.link}>{it.label}</a>
                )}
              </li>
              {!last && <li className={styles.separator} aria-hidden>{sep}</li>}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
