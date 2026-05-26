import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Mark.module.css'

export type MarkTone = 'accent' | 'warning'

export interface MarkProps extends HTMLAttributes<HTMLElement> {
  tone?: MarkTone
}

/** Inline highlight for matched text (search results, emphasis). */
export const Mark = forwardRef<HTMLElement, MarkProps>(function Mark(
  { tone = 'accent', className, ...rest },
  ref
) {
  return <mark ref={ref} className={cn(styles.mark, styles[`tone-${tone}`], className)} {...rest} />
})
