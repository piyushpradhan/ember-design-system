import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import styles from './Toggle.module.css'

export type ToggleVariant = 'default' | 'outline'
export type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange'> {
  /** Controlled pressed state. */
  pressed?: boolean
  /** Initial pressed state when uncontrolled. */
  defaultPressed?: boolean
  /** Called when the pressed state changes. */
  onPressedChange?: (pressed: boolean) => void
  variant?: ToggleVariant
  size?: ToggleSize
}

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  {
    pressed,
    defaultPressed = false,
    onPressedChange,
    variant = 'default',
    size = 'md',
    disabled,
    className,
    type = 'button',
    onClick,
    children,
    ...rest
  },
  ref
) {
  const [isPressed, setPressed] = useControllableState<boolean>({
    value: pressed,
    defaultValue: defaultPressed,
    onChange: onPressedChange,
  })

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      aria-pressed={isPressed}
      data-state={isPressed ? 'on' : 'off'}
      className={cn(
        styles.toggle,
        styles[`variant-${variant}`],
        styles[`size-${size}`],
        className
      )}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        setPressed((prev) => !prev)
      }}
      {...rest}
    >
      {children}
    </button>
  )
})
