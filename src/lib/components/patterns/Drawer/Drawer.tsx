import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { IconButton } from '../../primitives/IconButton'
import styles from './Drawer.module.css'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  side?: 'left' | 'right' | 'top' | 'bottom'
  title?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  size?: number | string
}

export function Drawer({ open, onClose, side = 'right', title, children, footer, size = 380 }: DrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const sizeStyle: React.CSSProperties =
    side === 'left' || side === 'right'
      ? { width: typeof size === 'number' ? `${size}px` : size }
      : { height: typeof size === 'number' ? `${size}px` : size }

  return createPortal(
    <div className={styles.backdrop} onClick={onClose}>
      <aside
        role="dialog"
        aria-modal="true"
        className={cn(styles.drawer, styles[`side-${side}`])}
        style={sizeStyle}
        onClick={(e) => e.stopPropagation()}
      >
        <header className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <IconButton aria-label="Close" icon={<X size={16} />} variant="ghost" size="sm" onClick={onClose} />
        </header>
        <div className={styles.content}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </aside>
    </div>,
    document.body
  )
}
