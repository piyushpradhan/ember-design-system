import { useEffect, useRef, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '../../../utils/cn'
import { IconButton } from '../../primitives/IconButton'
import styles from './Modal.module.css'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
  footer?: ReactNode
  closeOnBackdrop?: boolean
}

export function Modal({ open, onClose, title, description, size = 'md', children, footer, closeOnBackdrop = true }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousFocus = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previousFocus?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null

  const content = (
    <div className={styles.backdrop} onClick={() => closeOnBackdrop && onClose()}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(styles.modal, styles[`size-${size}`])}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
            {description && <p id="modal-description" className={styles.description}>{description}</p>}
          </div>
          <IconButton aria-label="Close" icon={<X size={16} />} variant="ghost" size="sm" onClick={onClose} />
        </div>
        {children && <div className={styles.content}>{children}</div>}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  )

  return createPortal(content, document.body)
}
