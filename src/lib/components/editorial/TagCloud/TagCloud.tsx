import type { HTMLAttributes } from 'react'
import { Tag } from '../../primitives/Tag'
import { cn } from '../../../utils/cn'
import styles from './TagCloud.module.css'

export interface TagCloudItem {
  label: string
  count?: number
  onClick?: () => void
}

export interface TagCloudProps extends HTMLAttributes<HTMLDivElement> {
  items: TagCloudItem[]
}

export function TagCloud({ items, className, ...rest }: TagCloudProps) {
  return (
    <div className={cn(styles.cloud, className)} {...rest}>
      {items.map((it) => (
        <Tag key={it.label} interactive onClick={it.onClick}>
          {it.label}
          {typeof it.count === 'number' && <span className={styles.count}>{it.count}</span>}
        </Tag>
      ))}
    </div>
  )
}
