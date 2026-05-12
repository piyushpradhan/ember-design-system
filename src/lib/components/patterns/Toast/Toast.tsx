import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Toast.module.css'

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info'

export interface Toast {
  id: string
  title: string
  description?: string
  tone?: ToastTone
  duration?: number
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    setToasts((current) => [...current, { ...t, id }])
    const duration = t.duration ?? 4000
    if (duration > 0) {
      window.setTimeout(() => dismiss(id), duration)
    }
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      {createPortal(
        <div className={styles.viewport} role="region" aria-label="Notifications">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
          ))}
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  )
}

const toneIcons: Record<ToastTone, ReactNode> = {
  neutral: <Info size={16} />,
  success: <CheckCircle2 size={16} />,
  warning: <AlertTriangle size={16} />,
  danger: <AlertCircle size={16} />,
  info: <Info size={16} />,
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [closing, setClosing] = useState(false)
  useEffect(() => {
    setClosing(false)
  }, [toast.id])

  const tone = toast.tone ?? 'neutral'

  return (
    <div
      role="status"
      className={cn(styles.toast, styles[`tone-${tone}`], closing && styles.closing)}
    >
      <span className={styles.icon}>{toneIcons[tone]}</span>
      <div className={styles.body}>
        <p className={styles.title}>{toast.title}</p>
        {toast.description && <p className={styles.description}>{toast.description}</p>}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        className={styles.dismiss}
        onClick={() => {
          setClosing(true)
          window.setTimeout(onDismiss, 120)
        }}
      >
        <X size={14} />
      </button>
    </div>
  )
}
