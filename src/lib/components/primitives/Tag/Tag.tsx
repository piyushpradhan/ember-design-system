import { forwardRef, type HTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Tag.module.css'

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void
  removable?: boolean
  interactive?: boolean
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { onRemove, removable, interactive, className, children, ...rest },
  ref
) {
  return (
    <span ref={ref} className={cn(styles.tag, interactive && styles.interactive, className)} {...rest}>
      <span className={styles.label}>{children}</span>
      {(removable || onRemove) && (
        <button
          type="button"
          aria-label="Remove tag"
          className={styles.remove}
          onClick={onRemove}
        >
          <X size={12} />
        </button>
      )}
    </span>
  )
})
