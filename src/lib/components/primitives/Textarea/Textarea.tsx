import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Textarea.module.css'

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, resize = 'vertical', className, rows = 4, ...rest },
  ref
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(styles.textarea, invalid && styles.invalid, className)}
      style={{ resize }}
      {...rest}
    />
  )
})
