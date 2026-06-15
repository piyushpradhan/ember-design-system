import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './AspectRatio.module.css'

export interface AspectRatioProps extends HTMLAttributes<HTMLDivElement> {
  /** Width / height ratio, e.g. 16 / 9 (default), 1, 4 / 3. */
  ratio?: number
}

export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, className, style, children, ...rest },
  ref
) {
  const safeRatio = ratio > 0 ? ratio : 16 / 9
  const ratioStyle = {
    '--ar-ratio': String(safeRatio),
    '--ar-padding': `${100 / safeRatio}%`,
  } as CSSProperties

  return (
    <div
      ref={ref}
      className={cn(styles.root, className)}
      style={{ ...ratioStyle, ...style }}
      {...rest}
    >
      <div className={styles.inner}>{children}</div>
    </div>
  )
})
