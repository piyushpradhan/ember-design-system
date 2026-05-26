import { forwardRef } from 'react'
import { Box, type BoxProps } from '../Box/Box'

export type GridProps = Omit<BoxProps, 'display' | 'direction'>

/** CSS grid container. `columns` accepts a count or a template string. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid(props, ref) {
  return <Box ref={ref} display="grid" {...props} />
})
