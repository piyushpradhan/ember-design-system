import { forwardRef } from 'react'
import { Text, type TextProps, type TextTone } from '../Text/Text'

export interface OverlineProps extends Omit<TextProps, 'family' | 'transform'> {
  tone?: TextTone
}

/**
 * Small, uppercase, letter-spaced mono label — used for section headings and
 * eyebrow text throughout the system.
 */
export const Overline = forwardRef<HTMLElement, OverlineProps>(function Overline(
  { as = 'div', size = '2xs', weight = 'semibold', tone = 'tertiary', tracking = 'widest', ...rest },
  ref
) {
  return (
    <Text
      ref={ref}
      as={as}
      family="mono"
      transform="uppercase"
      size={size}
      weight={weight}
      tone={tone}
      tracking={tracking}
      {...rest}
    />
  )
})
