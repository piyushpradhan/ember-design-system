import { useState, useRef, useId, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Tooltip.module.css'

export type TooltipSide = 'top' | 'right' | 'bottom' | 'left'

export interface TooltipProps {
  content: ReactNode
  side?: TooltipSide
  delay?: number
  children: ReactNode
}

export function Tooltip({ content, side = 'top', delay = 160, children }: TooltipProps) {
  const [open, setOpen] = useState(false)
  const id = useId()
  const timer = useRef<number | null>(null)

  const show = () => {
    if (timer.current) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpen(true), delay)
  }
  const hide = () => {
    if (timer.current) window.clearTimeout(timer.current)
    setOpen(false)
  }

  return (
    <span className={styles.wrap} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide}>
      <span aria-describedby={open ? id : undefined} className={styles.target}>
        {children}
      </span>
      <span
        id={id}
        role="tooltip"
        className={cn(styles.tooltip, styles[`side-${side}`], open && styles.open)}
      >
        {content}
      </span>
    </span>
  )
}
