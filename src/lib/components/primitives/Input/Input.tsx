import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Input.module.css'

export type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  inputSize?: InputSize
  invalid?: boolean
  disableFocus?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize = 'md', invalid, disableFocus, leadingIcon, trailingIcon, className, disabled, ...rest },
  ref
) {
  return (
    <div
      className={cn(
        styles.wrap,
        styles[`size-${inputSize}`],
        invalid && styles.invalid,
        disabled && styles.wrapDisabled,
        disableFocus && styles.noFocus
      )}
    >
      {leadingIcon && <span className={cn(styles.icon, styles.leading)}>{leadingIcon}</span>}
      <input
        ref={ref}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          styles.input,
          styles[`size-${inputSize}`],
          invalid && styles.invalid,
          leadingIcon && styles.hasLeading,
          trailingIcon && styles.hasTrailing,
          className
        )}
        {...rest}
      />
      {trailingIcon && <span className={cn(styles.icon, styles.trailing)}>{trailingIcon}</span>}
    </div>
  )
})
