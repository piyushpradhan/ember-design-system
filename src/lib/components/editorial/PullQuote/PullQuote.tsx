import type { BlockquoteHTMLAttributes, ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './PullQuote.module.css'

export interface PullQuoteProps extends BlockquoteHTMLAttributes<HTMLQuoteElement> {
  attribution?: ReactNode
  children: ReactNode
}

export function PullQuote({ attribution, className, children, ...rest }: PullQuoteProps) {
  return (
    <figure className={cn(styles.figure, className)}>
      <blockquote className={styles.quote} {...rest}>
        {children}
      </blockquote>
      {attribution && <figcaption className={styles.attribution}>— {attribution}</figcaption>}
    </figure>
  )
}
