import { forwardRef } from 'react'
import { Box, type BoxProps } from '../Box/Box'

export type FlexAlign = NonNullable<BoxProps['align']>
export type FlexJustify = NonNullable<BoxProps['justify']>
export type FlexDirection = NonNullable<BoxProps['direction']>

export interface FlexProps extends BoxProps {
  inline?: boolean
}

/** Flex container. Use Stack/Inline for the common column/row presets. */
export const Flex = forwardRef<HTMLElement, FlexProps>(function Flex(
  { inline = false, direction = 'row', ...props },
  ref
) {
  return <Box ref={ref} display={inline ? 'inline-flex' : 'flex'} direction={direction} {...props} />
})
