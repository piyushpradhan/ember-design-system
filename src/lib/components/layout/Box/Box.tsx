import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { cn } from '../../../utils/cn'
import { maybeSpace, tokenVars, type SpaceToken } from '../../../utils/space'
import styles from './Box.module.css'

export type BoxSurface =
  | 'canvas'
  | 'surface'
  | 'subtle'
  | 'muted'
  | 'accent'
  | 'accent-soft'
  | 'transparent'
export type BoxBorder = boolean | 'subtle' | 'default' | 'strong'
export type BoxRadius = 'none' | 'sm' | 'md' | 'lg' | 'pill'
export type BoxShadow = 'sm' | 'md'
export type BoxPosition = 'relative' | 'absolute' | 'fixed' | 'static'
export type BoxOverflow = 'visible' | 'hidden' | 'auto'
export type BoxDisplay = 'block' | 'flex' | 'inline-flex' | 'grid' | 'inline' | 'none'
export type BoxAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline'
export type BoxJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
export type BoxDirection = 'row' | 'column'

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** Render as a different element (div, section, header, span, …). */
  as?: ElementType
  display?: BoxDisplay
  // Flex / grid layout
  direction?: BoxDirection
  gap?: SpaceToken
  align?: BoxAlign
  justify?: BoxJustify
  wrap?: boolean
  columns?: number | string
  grow?: number
  shrink?: number
  // Spacing
  p?: SpaceToken
  px?: SpaceToken
  py?: SpaceToken
  pt?: SpaceToken
  pr?: SpaceToken
  pb?: SpaceToken
  pl?: SpaceToken
  // Surface
  bg?: BoxSurface
  border?: BoxBorder
  radius?: BoxRadius
  shadow?: BoxShadow
  // Box model
  position?: BoxPosition
  overflow?: BoxOverflow
  fullWidth?: boolean
  fullHeight?: boolean
  /** Pointer cursor + smooth colour transitions for clickable surfaces. */
  interactive?: boolean
}

export const Box = forwardRef<HTMLElement, BoxProps>(function Box(
  {
    as: Tag = 'div',
    display,
    direction,
    gap,
    align,
    justify,
    wrap,
    columns,
    grow,
    shrink,
    p,
    px,
    py,
    pt,
    pr,
    pb,
    pl,
    bg,
    border,
    radius,
    shadow,
    position,
    overflow,
    fullWidth,
    fullHeight,
    interactive,
    className,
    style,
    ...rest
  },
  ref
) {
  const borderClass =
    border === true ? 'border-default' : border ? `border-${border}` : undefined

  const template =
    typeof columns === 'number' ? `repeat(${columns}, minmax(0, 1fr))` : columns

  const vars = tokenVars({
    '--box-p': maybeSpace(p),
    '--box-px': maybeSpace(px),
    '--box-py': maybeSpace(py),
    '--box-pt': maybeSpace(pt),
    '--box-pr': maybeSpace(pr),
    '--box-pb': maybeSpace(pb),
    '--box-pl': maybeSpace(pl),
    '--box-gap': maybeSpace(gap),
    '--box-cols': template,
    '--box-grow': grow,
    '--box-shrink': shrink,
  })

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={cn(
        styles.box,
        display && styles[`display-${display}`],
        direction && styles[`dir-${direction}`],
        gap !== undefined && styles.gap,
        align && styles[`align-${align}`],
        justify && styles[`justify-${justify}`],
        wrap && styles.wrap,
        columns !== undefined && styles.cols,
        p !== undefined && styles.p,
        px !== undefined && styles.px,
        py !== undefined && styles.py,
        pt !== undefined && styles.pt,
        pr !== undefined && styles.pr,
        pb !== undefined && styles.pb,
        pl !== undefined && styles.pl,
        bg && styles[`bg-${bg}`],
        borderClass && styles[borderClass],
        radius && styles[`radius-${radius}`],
        shadow && styles[`shadow-${shadow}`],
        position && styles[`pos-${position}`],
        overflow && styles[`overflow-${overflow}`],
        fullWidth && styles.fullWidth,
        fullHeight && styles.fullHeight,
        interactive && styles.interactive,
        grow !== undefined && styles.grow,
        shrink !== undefined && styles.shrink,
        className
      )}
      style={{ ...vars, ...style } as CSSProperties}
      {...rest}
    />
  )
})
