import { forwardRef, useState, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Avatar.module.css'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  shape?: 'circle' | 'square'
  status?: 'online' | 'offline' | 'away' | 'busy'
}

function initialsFor(name?: string): string {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt, name, size = 'md', shape = 'circle', status, className, ...rest },
  ref
) {
  const [errored, setErrored] = useState(false)
  const showImg = src && !errored
  return (
    <span ref={ref} className={cn(styles.avatar, styles[`size-${size}`], styles[`shape-${shape}`], className)} {...rest}>
      {showImg ? (
        <img src={src} alt={alt ?? name ?? ''} onError={() => setErrored(true)} className={styles.img} />
      ) : (
        <span className={styles.initials} aria-hidden={!!name}>{initialsFor(name)}</span>
      )}
      {status && <span className={cn(styles.status, styles[`status-${status}`])} aria-label={status} />}
    </span>
  )
})

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number
}

export function AvatarGroup({ max, children, className, ...rest }: AvatarGroupProps) {
  return (
    <div className={cn(styles.group, className)} {...rest}>
      {children}
      {typeof max === 'number' && <span className={cn(styles.avatar, styles[`size-md`], styles[`shape-circle`], styles.overflow)}>+{max}</span>}
    </div>
  )
}
