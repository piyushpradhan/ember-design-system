import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../../utils/cn'
import styles from './Tabs.module.css'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabs(): TabsContextValue {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs subcomponent must be used within <Tabs>')
  return ctx
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string
  value?: string
  onValueChange?: (v: string) => void
  children: ReactNode
}

export function Tabs({ defaultValue, value, onValueChange, className, children, ...rest }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue)
  const baseId = useId()
  const active = value ?? internal
  const set = (v: string) => {
    if (value === undefined) setInternal(v)
    onValueChange?.(v)
  }
  return (
    <TabsContext.Provider value={{ value: active, setValue: set, baseId }}>
      <div className={cn(styles.root, className)} {...rest}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div role="tablist" className={cn(styles.list, className)} {...rest}>
      {children}
    </div>
  )
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...rest }: TabsTriggerProps) {
  const { value: active, setValue, baseId } = useTabs()
  const selected = active === value
  return (
    <button
      role="tab"
      type="button"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      onClick={() => setValue(value)}
      className={cn(styles.trigger, selected && styles.active, className)}
      {...rest}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string
}

export function TabsContent({ value, className, children, ...rest }: TabsContentProps) {
  const { value: active, baseId } = useTabs()
  if (active !== value) return null
  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn(styles.content, className)}
      {...rest}
    >
      {children}
    </div>
  )
}
