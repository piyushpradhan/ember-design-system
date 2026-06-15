import { forwardRef, type HTMLAttributes, type ReactNode } from 'react'
import { Info, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Alert.module.css'

export type AlertVariant = 'default' | 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  /** Custom leading icon. Pass `null` to hide the icon entirely. */
  icon?: ReactNode
}

const defaultIcons: Record<AlertVariant, ReactNode> = {
  default: <Info aria-hidden size={18} strokeWidth={1.75} />,
  info: <Info aria-hidden size={18} strokeWidth={1.75} />,
  success: <CheckCircle2 aria-hidden size={18} strokeWidth={1.75} />,
  warning: <AlertTriangle aria-hidden size={18} strokeWidth={1.75} />,
  danger: <AlertCircle aria-hidden size={18} strokeWidth={1.75} />,
}

export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'default', icon, role, className, children, ...rest },
  ref
) {
  const resolvedRole = role ?? (variant === 'danger' || variant === 'warning' ? 'alert' : 'status')
  // `icon === undefined` => use the variant default; `icon === null` => no icon.
  const resolvedIcon = icon === undefined ? defaultIcons[variant] : icon

  return (
    <div
      ref={ref}
      role={resolvedRole}
      className={cn(styles.alert, styles[`variant-${variant}`], className)}
      {...rest}
    >
      {resolvedIcon != null && <span className={styles.icon}>{resolvedIcon}</span>}
      <div className={styles.body}>{children}</div>
    </div>
  )
})

export function AlertTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h5 className={cn(styles.title, className)} {...rest} />
}

export function AlertDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <div className={cn(styles.description, className)} {...rest} />
}
