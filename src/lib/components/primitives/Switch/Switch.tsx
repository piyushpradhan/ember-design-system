import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Switch.module.css'

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
  description?: ReactNode
  switchSize?: 'sm' | 'md'
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  { label, description, switchSize = 'md', className, id, ...rest },
  ref
) {
  const generatedId = id || `switch-${Math.random().toString(36).slice(2, 8)}`
  const control = (
    <span className={cn(styles.control, styles[`size-${switchSize}`])}>
      <input ref={ref} id={generatedId} type="checkbox" role="switch" className={styles.input} {...rest} />
      <span className={styles.track}>
        <span className={styles.thumb} />
      </span>
    </span>
  )
  if (!label && !description) return <label className={cn(styles.wrap, className)}>{control}</label>
  return (
    <label htmlFor={generatedId} className={cn(styles.wrap, className)}>
      {control}
      <span className={styles.text}>
        {label && <span className={styles.label}>{label}</span>}
        {description && <span className={styles.description}>{description}</span>}
      </span>
    </label>
  )
})
