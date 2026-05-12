import type { HTMLAttributes } from 'react'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Pagination.module.css'

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  page: number
  total: number
  onPageChange: (page: number) => void
  siblingCount?: number
}

function range(start: number, end: number): number[] {
  const r: number[] = []
  for (let i = start; i <= end; i++) r.push(i)
  return r
}

function paginationRange(page: number, total: number, siblings: number): (number | 'ellipsis')[] {
  const totalNumbers = siblings * 2 + 5
  if (totalNumbers >= total) return range(1, total)
  const leftSibling = Math.max(page - siblings, 1)
  const rightSibling = Math.min(page + siblings, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1
  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblings * 2), 'ellipsis', total]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis', ...range(total - (siblings * 2 + 2), total)]
  }
  return [1, 'ellipsis', ...range(leftSibling, rightSibling), 'ellipsis', total]
}

export function Pagination({ page, total, onPageChange, siblingCount = 1, className, ...rest }: PaginationProps) {
  const items = paginationRange(page, total, siblingCount)
  return (
    <nav aria-label="Pagination" className={cn(styles.nav, className)} {...rest}>
      <button
        type="button"
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className={cn(styles.btn, styles.arrow)}
      >
        <ChevronLeft size={14} />
      </button>
      {items.map((it, i) =>
        it === 'ellipsis' ? (
          <span key={`e-${i}`} className={styles.ellipsis} aria-hidden>
            <MoreHorizontal size={14} />
          </span>
        ) : (
          <button
            key={it}
            type="button"
            aria-current={it === page ? 'page' : undefined}
            onClick={() => onPageChange(it)}
            className={cn(styles.btn, it === page && styles.active)}
          >
            {it}
          </button>
        )
      )}
      <button
        type="button"
        aria-label="Next page"
        disabled={page >= total}
        onClick={() => onPageChange(page + 1)}
        className={cn(styles.btn, styles.arrow)}
      >
        <ChevronRight size={14} />
      </button>
    </nav>
  )
}
