import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import styles from './Accordion.module.css'

interface AccordionContextValue {
  openValues: Set<string>
  toggle: (v: string) => void
  type: 'single' | 'multiple'
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

function useAccordion() {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('Accordion subcomponent must be used within <Accordion>')
  return ctx
}

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  children: ReactNode
}

export function Accordion({ type = 'single', defaultValue, className, children, ...rest }: AccordionProps) {
  const initial = new Set<string>(
    defaultValue ? (Array.isArray(defaultValue) ? defaultValue : [defaultValue]) : []
  )
  const [openValues, setOpenValues] = useState<Set<string>>(initial)
  const toggle = (v: string) => {
    setOpenValues((prev) => {
      const next = new Set(prev)
      if (next.has(v)) {
        next.delete(v)
      } else {
        if (type === 'single') next.clear()
        next.add(v)
      }
      return next
    })
  }
  return (
    <AccordionContext.Provider value={{ openValues, toggle, type }}>
      <div className={cn(styles.root, className)} {...rest}>{children}</div>
    </AccordionContext.Provider>
  )
}

export interface AccordionItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  value: string
  title: ReactNode
  children: ReactNode
}

export function AccordionItem({ value, title, className, children, ...rest }: AccordionItemProps) {
  const { openValues, toggle } = useAccordion()
  const open = openValues.has(value)
  const triggerId = `accordion-trigger-${value}`
  const panelId = `accordion-panel-${value}`
  return (
    <div className={cn(styles.item, className)} {...rest}>
      <h3 className={styles.heading}>
        <button
          type="button"
          id={triggerId}
          aria-controls={panelId}
          aria-expanded={open}
          className={styles.trigger}
          onClick={() => toggle(value)}
        >
          <span>{title}</span>
          <ChevronDown size={16} className={cn(styles.chevron, open && styles.chevronOpen)} aria-hidden />
        </button>
      </h3>
      {open && (
        <div role="region" id={panelId} aria-labelledby={triggerId} className={styles.panel}>
          {children}
        </div>
      )}
    </div>
  )
}
