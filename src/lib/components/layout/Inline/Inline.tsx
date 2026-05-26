import { forwardRef } from 'react'
import { Box, type BoxProps } from '../Box/Box'

export type InlineProps = Omit<BoxProps, 'direction' | 'display'>

/** Horizontal flex container. Defaults to vertically-centered items. */
export const Inline = forwardRef<HTMLElement, InlineProps>(function Inline(
  { align = 'center', ...props },
  ref
) {
  return <Box ref={ref} display="flex" direction="row" align={align} {...props} />
})
