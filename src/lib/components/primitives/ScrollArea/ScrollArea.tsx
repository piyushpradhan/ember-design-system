import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './ScrollArea.module.css'

export type ScrollAreaOrientation = 'vertical' | 'horizontal' | 'both'

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  /** Which axis (or axes) the viewport may scroll along. Default `'vertical'`. */
  orientation?: ScrollAreaOrientation
  /** Caps the height of the scroll viewport; accepts any CSS length. */
  maxHeight?: number | string
}

/**
 * A scrollable region with a tasteful, thin custom scrollbar that preserves
 * native scrolling and keyboard interaction. Children render inside a viewport
 * whose overflow is determined by `orientation`.
 */
export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { orientation = 'vertical', maxHeight, className, style, children, ...rest },
  ref
) {
  const resolvedMaxHeight =
    typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight

  return (
    <div
      ref={ref}
      className={cn(styles.viewport, styles[`orient-${orientation}`], className)}
      data-orientation={orientation}
      tabIndex={0}
      style={{ maxHeight: resolvedMaxHeight, ...style }}
      {...rest}
    >
      {children}
    </div>
  )
})
