import type { HTMLAttributes, ReactNode } from 'react'
import { Avatar } from '../../primitives/Avatar'
import { cn } from '../../../utils/cn'
import styles from './AuthorByline.module.css'

export interface AuthorBylineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'role'> {
  name: string
  role?: ReactNode
  date?: ReactNode
  avatarSrc?: string
  href?: string
}

export function AuthorByline({ name, role, date, avatarSrc, href, className, ...rest }: AuthorBylineProps) {
  return (
    <div className={cn(styles.byline, className)} {...rest}>
      <Avatar name={name} src={avatarSrc} size="md" />
      <div className={styles.body}>
        <p className={styles.name}>
          {href ? (
            <a href={href}>{name}</a>
          ) : (
            name
          )}
        </p>
        {(role || date) && (
          <p className={styles.meta}>
            {role}
            {role && date && <span aria-hidden> · </span>}
            {date}
          </p>
        )}
      </div>
    </div>
  )
}
