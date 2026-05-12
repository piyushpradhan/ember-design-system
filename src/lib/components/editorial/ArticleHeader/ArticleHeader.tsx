import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './ArticleHeader.module.css'

export interface ArticleHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode
  subtitle?: ReactNode
  eyebrow?: ReactNode
  date?: ReactNode
  readTime?: ReactNode
  tags?: ReactNode
}

export function ArticleHeader({ title, subtitle, eyebrow, date, readTime, tags, className, ...rest }: ArticleHeaderProps) {
  return (
    <header className={cn(styles.header, className)} {...rest}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <h1 className={styles.title}>{title}</h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {(date || readTime) && (
        <p className={styles.meta}>
          {date && <span>{date}</span>}
          {date && readTime && <span aria-hidden> · </span>}
          {readTime && <span>{readTime}</span>}
        </p>
      )}
      {tags && <div className={styles.tags}>{tags}</div>}
    </header>
  )
}
