import { forwardRef, type LabelHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Label.module.css'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  optional?: boolean
  hint?: ReactNode
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required, optional, hint, className, children, ...rest },
  ref
) {
  return (
    <label ref={ref} className={cn(styles.label, className)} {...rest}>
      <span className={styles.text}>
        {children}
        {required && <span className={styles.required} aria-label="required">*</span>}
        {optional && <span className={styles.optional}>(optional)</span>}
      </span>
      {hint && <span className={styles.hint}>{hint}</span>}
    </label>
  )
})
