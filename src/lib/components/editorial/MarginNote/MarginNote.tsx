import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './MarginNote.module.css'

export interface MarginNoteProps extends HTMLAttributes<HTMLElement> {
  side?: 'left' | 'right'
  label?: ReactNode
  children: ReactNode
}

export function MarginNote({ side = 'right', label, className, children, ...rest }: MarginNoteProps) {
  return (
    <aside className={cn(styles.note, styles[`side-${side}`], className)} {...rest}>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.body}>{children}</span>
    </aside>
  )
}
