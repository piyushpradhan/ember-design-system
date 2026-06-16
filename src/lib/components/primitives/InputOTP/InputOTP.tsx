import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ClipboardEvent,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { cn } from '../../../utils/cn'
import { useControllableState } from '../../../utils/useControllableState'
import styles from './InputOTP.module.css'

export type InputOTPPattern = 'numeric' | 'alphanumeric'

export interface InputOTPProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Number of character slots. */
  length?: number
  /** Controlled value. */
  value?: string
  /** Initial value when uncontrolled. */
  defaultValue?: string
  /** Called with the full string whenever it changes. */
  onChange?: (value: string) => void
  /** Called once the value fills every slot. */
  onComplete?: (value: string) => void
  /** Which characters are accepted. */
  pattern?: InputOTPPattern
  disabled?: boolean
  'aria-label'?: string
}

const PATTERNS: Record<InputOTPPattern, RegExp> = {
  numeric: /[0-9]/,
  alphanumeric: /[a-zA-Z0-9]/,
}

function sanitize(raw: string, pattern: InputOTPPattern, length: number): string {
  const re = PATTERNS[pattern]
  return Array.from(raw)
    .filter((ch) => re.test(ch))
    .join('')
    .slice(0, length)
}

export const InputOTP = forwardRef<HTMLDivElement, InputOTPProps>(function InputOTP(
  {
    length = 6,
    value,
    defaultValue = '',
    onChange,
    onComplete,
    pattern = 'numeric',
    disabled = false,
    className,
    'aria-label': ariaLabel = 'One-time password',
    ...rest
  },
  ref
) {
  const [otp, setOtp] = useControllableState<string>({
    value: value === undefined ? undefined : sanitize(value, pattern, length),
    defaultValue: sanitize(defaultValue, pattern, length),
    onChange,
  })

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  const registerInput = useCallback((index: number, node: HTMLInputElement | null) => {
    inputRefs.current[index] = node
  }, [])

  const chars = Array.from({ length }, (_, i) => otp[i] ?? '')

  // Fire onComplete exactly when the value transitions to full.
  const wasComplete = useRef(false)
  useEffect(() => {
    const complete = otp.length === length
    if (complete && !wasComplete.current) {
      onComplete?.(otp)
    }
    wasComplete.current = complete
  }, [otp, length, onComplete])

  const focusIndex = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), length - 1)
      const node = inputRefs.current[clamped]
      node?.focus()
      node?.select()
      setActiveIndex(clamped)
    },
    [length]
  )

  const setCharAt = useCallback(
    (index: number, char: string) => {
      setOtp((prev) => {
        const arr = Array.from({ length }, (_, i) => prev[i] ?? '')
        arr[index] = char
        // OTP entry is contiguous left-to-right; joining empties collapses any
        // cleared slot so the stored value never contains internal gaps.
        return arr.join('')
      })
    },
    [setOtp, length]
  )

  const handleChange = useCallback(
    (index: number, rawValue: string) => {
      if (disabled) return
      const sanitized = sanitize(rawValue, pattern, length)
      if (sanitized.length === 0) return
      // If multiple characters arrived (autofill / fast typing), distribute them.
      if (sanitized.length > 1) {
        setOtp((prev) => {
          const arr = Array.from({ length }, (_, i) => prev[i] ?? '')
          let cursor = index
          for (const ch of sanitized) {
            if (cursor >= length) break
            arr[cursor] = ch
            cursor += 1
          }
          return arr.join('')
        })
        focusIndex(index + sanitized.length)
        return
      }
      setCharAt(index, sanitized[0])
      focusIndex(index + 1)
    },
    [disabled, pattern, length, setOtp, setCharAt, focusIndex]
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>, index: number) => {
      if (disabled) return
      switch (event.key) {
        case 'Backspace': {
          event.preventDefault()
          if (chars[index]) {
            setCharAt(index, '')
            // Stay on the cleared slot.
          } else if (index > 0) {
            setCharAt(index - 1, '')
            focusIndex(index - 1)
          }
          break
        }
        case 'Delete': {
          event.preventDefault()
          setCharAt(index, '')
          break
        }
        case 'ArrowLeft':
          event.preventDefault()
          focusIndex(index - 1)
          break
        case 'ArrowRight':
          event.preventDefault()
          focusIndex(index + 1)
          break
        case 'Home':
          event.preventDefault()
          focusIndex(0)
          break
        case 'End':
          event.preventDefault()
          focusIndex(length - 1)
          break
        default:
          break
      }
    },
    [disabled, chars, setCharAt, focusIndex, length]
  )

  const handlePaste = useCallback(
    (event: ClipboardEvent<HTMLInputElement>, index: number) => {
      if (disabled) return
      event.preventDefault()
      const pasted = sanitize(event.clipboardData.getData('text'), pattern, length)
      if (!pasted) return
      setOtp((prev) => {
        const arr = Array.from({ length }, (_, i) => prev[i] ?? '')
        let cursor = index
        for (const ch of pasted) {
          if (cursor >= length) break
          arr[cursor] = ch
          cursor += 1
        }
        return arr.join('')
      })
      focusIndex(index + pasted.length)
    },
    [disabled, pattern, length, setOtp, focusIndex]
  )

  const inputMode = pattern === 'numeric' ? 'numeric' : 'text'

  return (
    <div
      ref={ref}
      role="group"
      aria-label={ariaLabel}
      data-disabled={disabled ? '' : undefined}
      className={cn(styles.root, disabled && styles.disabled, className)}
      {...rest}
    >
      {chars.map((char, index) => (
        <input
          key={`otp-slot-${index}`}
          ref={(node) => registerInput(index, node)}
          type="text"
          inputMode={inputMode}
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          disabled={disabled}
          value={char}
          aria-label={`Digit ${index + 1} of ${length}`}
          data-active={activeIndex === index ? '' : undefined}
          data-filled={char ? '' : undefined}
          className={styles.slot}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(event, index)}
          onPaste={(event) => handlePaste(event, index)}
          onFocus={() => setActiveIndex(index)}
        />
      ))}
    </div>
  )
})

export type InputOTPSeparatorProps = HTMLAttributes<HTMLSpanElement>

/** Optional visual separator (e.g. a dash) for use between OTP slot groups. */
export const InputOTPSeparator = forwardRef<HTMLSpanElement, InputOTPSeparatorProps>(
  function InputOTPSeparator({ className, children, ...rest }, ref) {
    return (
      <span
        ref={ref}
        role="separator"
        aria-hidden="true"
        className={cn(styles.separator, className)}
        {...rest}
      >
        {children ?? '-'}
      </span>
    )
  }
)
