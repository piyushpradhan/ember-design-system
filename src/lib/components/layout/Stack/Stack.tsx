import { forwardRef } from 'react'
import { Box, type BoxProps } from '../Box/Box'

export type StackProps = Omit<BoxProps, 'direction' | 'display'>

/** Vertical flex container. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(props, ref) {
  return <Box ref={ref} display="flex" direction="column" {...props} />
})
