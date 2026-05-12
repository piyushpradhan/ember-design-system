import { cloneElement, isValidElement, useId, type HTMLAttributes, type ReactElement, type ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { Label } from '../../primitives/Label'
import styles from './FormField.module.css'

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: ReactNode
  hint?: ReactNode
  error?: ReactNode
  required?: boolean
  optional?: boolean
  children: ReactNode
}

export function FormField({ label, hint, error, required, optional, className, children, ...rest }: FormFieldProps) {
  const id = useId()
  const fieldId = `field-${id}`
  const hintId = hint ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const described = [hintId, errorId].filter(Boolean).join(' ') || undefined

  let control = children
  if (isValidElement(children)) {
    const child = children as ReactElement<{ id?: string; 'aria-describedby'?: string; invalid?: boolean; 'aria-invalid'?: boolean }>
    control = cloneElement(child, {
      id: fieldId,
      'aria-describedby': described,
      ...(error ? { invalid: true, 'aria-invalid': true } : {}),
    })
  }

  return (
    <div className={cn(styles.field, className)} {...rest}>
      {label && (
        <Label htmlFor={fieldId} required={required} optional={optional}>
          {label}
        </Label>
      )}
      {control}
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          <AlertCircle size={12} aria-hidden />
          {error}
        </p>
      )}
      {!error && hint && (
        <p id={hintId} className={styles.hint}>
          {hint}
        </p>
      )}
    </div>
  )
}
