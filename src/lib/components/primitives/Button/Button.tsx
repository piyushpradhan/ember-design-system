import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { Tooltip, type TooltipSide } from '../Tooltip'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leadingIcon?: ReactNode
  trailingIcon?: ReactNode
  fullWidth?: boolean
  tooltip?: ReactNode
  tooltipSide?: TooltipSide
  tooltipDelay?: number
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    size = 'md',
    loading = false,
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    disabled,
    className,
    children,
    type = 'button',
    tooltip,
    tooltipSide,
    tooltipDelay,
    ...rest
  },
  ref
) {
  const button = (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      data-loading={loading || undefined}
      className={cn(
        styles.button,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        fullWidth && styles.fullWidth,
        className
      )}
      {...rest}
    >
      {loading ? (
        <Loader2 className={styles.spinner} size={size === 'lg' ? 18 : 14} aria-hidden />
      ) : (
        leadingIcon && <span className={styles.icon}>{leadingIcon}</span>
      )}
      <span className={styles.label}>{children}</span>
      {trailingIcon && !loading && <span className={styles.icon}>{trailingIcon}</span>}
    </button>
  )

  if (tooltip) {
    return (
      <Tooltip content={tooltip} side={tooltipSide} delay={tooltipDelay}>
        {button}
      </Tooltip>
    )
  }

  return button
})
