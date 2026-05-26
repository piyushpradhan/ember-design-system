import {
  forwardRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { cn } from '../../../utils/cn'
import { tokenVars } from '../../../utils/space'
import styles from './Text.module.css'

export type TextSize = '2xs' | 'xs' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold'
export type TextTone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'inverse'
  | 'accent'
  | 'accent-ink'
  | 'danger'
  | 'success'
  | 'warning'
export type TextFamily = 'sans' | 'mono' | 'serif'
export type TextLeading = 'tight' | 'snug' | 'base' | 'relaxed'
export type TextTracking = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest'
export type TextAlign = 'left' | 'center' | 'right'
export type TextWhitespace = 'normal' | 'nowrap' | 'pre' | 'pre-wrap'

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  /** Token size key, or a raw pixel number for fine-grained control. */
  size?: TextSize | number
  weight?: TextWeight
  tone?: TextTone
  family?: TextFamily
  leading?: TextLeading | number
  tracking?: TextTracking
  align?: TextAlign
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  italic?: boolean
  /** Single-line ellipsis truncation. */
  truncate?: boolean
  tabularNums?: boolean
  whitespace?: TextWhitespace
  /** Fill remaining space in a flex parent (and allow truncation). */
  grow?: boolean
  /** Prevent shrinking in a flex parent. */
  shrink?: boolean
}

const SIZE_TOKENS = new Set<TextSize>([
  '2xs',
  'xs',
  'sm',
  'base',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
])

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  {
    as: Tag = 'span',
    size,
    weight,
    tone,
    family,
    leading,
    tracking,
    align,
    transform,
    italic,
    truncate,
    tabularNums,
    whitespace,
    grow,
    shrink,
    className,
    style,
    ...rest
  },
  ref
) {
  const sizeIsToken = typeof size === 'string' && SIZE_TOKENS.has(size)
  const vars = tokenVars({
    '--text-fs': typeof size === 'number' ? `${size}px` : undefined,
    '--text-lh': typeof leading === 'number' ? String(leading) : undefined,
  })

  return (
    <Tag
      ref={ref as Ref<HTMLElement>}
      className={cn(
        styles.text,
        sizeIsToken && styles[`size-${size as TextSize}`],
        typeof size === 'number' && styles.sizeCustom,
        weight && styles[`weight-${weight}`],
        tone && styles[`tone-${tone}`],
        family && styles[`family-${family}`],
        typeof leading === 'string' && styles[`leading-${leading}`],
        typeof leading === 'number' && styles.leadingCustom,
        tracking && styles[`tracking-${tracking}`],
        align && styles[`align-${align}`],
        transform && transform !== 'none' && styles[`transform-${transform}`],
        italic && styles.italic,
        truncate && styles.truncate,
        tabularNums && styles.tabular,
        whitespace && styles[`ws-${whitespace}`],
        grow && styles.grow,
        shrink && styles.shrink,
        className
      )}
      style={{ ...vars, ...style } as CSSProperties}
      {...rest}
    />
  )
})
