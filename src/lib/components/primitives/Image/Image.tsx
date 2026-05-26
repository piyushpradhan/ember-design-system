import { forwardRef, type CSSProperties, type ImgHTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Image.module.css'

export type ImageFit = 'contain' | 'cover' | 'fill' | 'none'
export type ImageRadius = 'none' | 'sm' | 'md' | 'lg'

export interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fit?: ImageFit
  radius?: ImageRadius
  /** Subtle placeholder background while loading / for transparent images. */
  bg?: boolean
  maxHeight?: number | string
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  { fit = 'contain', radius, bg = false, maxHeight, className, style, ...rest },
  ref
) {
  return (
    <img
      ref={ref}
      className={cn(
        styles.image,
        styles[`fit-${fit}`],
        radius && styles[`radius-${radius}`],
        bg && styles.bg,
        className
      )}
      style={
        {
          maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
          ...style,
        } as CSSProperties
      }
      {...rest}
    />
  )
})
