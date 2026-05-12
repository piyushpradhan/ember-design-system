import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Select.module.css'

export type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  selectSize?: SelectSize
  invalid?: boolean
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { selectSize = 'md', invalid, className, children, ...rest },
  ref
) {
  return (
    <div className={cn(styles.wrap, styles[`size-${selectSize}`], invalid && styles.invalid)}>
      <select
        ref={ref}
        aria-invalid={invalid || undefined}
        className={cn(styles.select, className)}
        {...rest}
      >
        {children}
      </select>
      <ChevronDown size={14} className={styles.chevron} aria-hidden />
    </div>
  )
})
