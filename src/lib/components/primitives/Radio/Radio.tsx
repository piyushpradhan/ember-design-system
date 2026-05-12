import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Radio.module.css'

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode
  description?: ReactNode
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { label, description, className, id, ...rest },
  ref
) {
  const generatedId = id || `radio-${Math.random().toString(36).slice(2, 8)}`
  const control = (
    <span className={styles.control} aria-hidden>
      <input ref={ref} id={generatedId} type="radio" className={styles.input} {...rest} />
      <span className={styles.dot} />
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

export interface RadioGroupProps {
  name: string
  value?: string
  onChange?: (value: string) => void
  children: ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export function RadioGroup({ name, onChange, children, orientation = 'vertical' }: RadioGroupProps) {
  return (
    <div role="radiogroup" className={cn(styles.group, styles[`orient-${orientation}`])} onChange={(e) => {
      const target = e.target as HTMLInputElement
      if (target.name === name && onChange) onChange(target.value)
    }}>
      {children}
    </div>
  )
}
