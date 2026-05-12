import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize
  invalid?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid, leadingIcon, trailingIcon, className, disabled, ...rest },
  ref
) {
  const inner = (
    <input
      ref={ref}
      disabled={disabled}
      aria-invalid={invalid || undefined}
      className={cn(
        styles.input,
        styles[`size-${inputSize}`],
        invalid && styles.invalid,
        (leadingIcon || trailingIcon) && styles.hasIcon,
        className
      )}
      {...rest}
    />
  )
  if (!leadingIcon && !trailingIcon) return inner
  return (
    <div className={cn(styles.wrap, styles[`size-${inputSize}`], invalid && styles.invalid)}>
      {leadingIcon && <span className={cn(styles.icon, styles.leading)}>{leadingIcon}</span>}
      {inner}
      {trailingIcon && <span className={cn(styles.icon, styles.trailing)}>{trailingIcon}</span>}
    </div>
  )
})
