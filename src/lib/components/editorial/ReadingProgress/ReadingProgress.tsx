import { useEffect, useState, type HTMLAttributes } from 'react'
import { cn } from '../../../utils/cn'
import styles from './ReadingProgress.module.css'

export interface ReadingProgressProps extends HTMLAttributes<HTMLDivElement> {
  target?: HTMLElement | null
}

export function ReadingProgress({ target, className, ...rest }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = target ?? document.documentElement
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const height = el.scrollHeight - el.clientHeight
      const pct = height > 0 ? Math.min(1, Math.max(0, scrollTop / height)) : 0
      setProgress(pct)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [target])

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(styles.bar, className)}
      {...rest}
    >
      <div className={styles.fill} style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
