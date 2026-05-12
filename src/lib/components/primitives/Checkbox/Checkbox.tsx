import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { Check, Minus } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Checkbox.module.css'

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  indeterminate?: boolean
  label?: ReactNode
  description?: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { indeterminate, label, description, className, id, ...rest },
  ref
) {
  const generatedId = id || `checkbox-${Math.random().toString(36).slice(2, 8)}`
  const control = (
    <span className={styles.control} aria-hidden>
      <input
        ref={ref}
        id={generatedId}
        type="checkbox"
        className={styles.input}
        aria-checked={indeterminate ? 'mixed' : undefined}
        {...rest}
      />
      <span className={styles.box}>
        {indeterminate ? <Minus size={12} strokeWidth={3} /> : <Check size={12} strokeWidth={3} />}
      </span>
    </span>
  )
  if (!label && !description) return <label className={cn(styles.wrap, className)}>{control}</label>
  return (
    <label htmlFor={generatedId} className={cn(styles.wrap, styles.withLabel, className)}>
      {control}
      <span className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  )
})
