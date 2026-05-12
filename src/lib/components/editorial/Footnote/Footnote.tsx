import { useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Footnote.module.css'

export interface FootnoteProps extends HTMLAttributes<HTMLSpanElement> {
  number: number
  children: ReactNode
}

export function Footnote({ number, className, children, ...rest }: FootnoteProps) {
  const [open, setOpen] = useState(false)
  return (
    <span className={cn(styles.wrap, className)} {...rest}>
      <button
        type="button"
        aria-expanded={open}
        aria-label={`Footnote ${number}`}
        className={styles.marker}
        onClick={() => setOpen((v) => !v)}
      >
        {number}
      </button>
      {open && (
        <span role="note" className={styles.body}>
          <span className={styles.bodyNumber}>{number}.</span>
          {children}
        </span>
      )}
    </span>
  )
}
