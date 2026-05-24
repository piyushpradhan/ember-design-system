import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import { Tooltip, type TooltipSide } from '../Tooltip'
import styles from './IconButton.module.css'

export type IconButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type IconButtonSize = 'sm' | 'md' | 'lg'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
  /** Accessible label — required */
  'aria-label': string
  icon: ReactNode
  tooltip?: ReactNode
  tooltipSide?: TooltipSide
  tooltipDelay?: number
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'ghost', size = 'md', icon, className, type = 'button', tooltip, tooltipSide, tooltipDelay, ...rest },
  ref
) {
  const button = (
    <button
      ref={ref}
      type={type}
      className={cn(styles.button, styles[`variant-${variant}`], styles[`size-${size}`], className)}
      {...rest}
    >
      {icon}
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
