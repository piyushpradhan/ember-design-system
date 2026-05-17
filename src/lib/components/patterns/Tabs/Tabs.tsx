import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'
import { cn } from '../../../utils/cn'
import styles from './Tabs.module.css'

interface TabsContextValue {
  value: string
  setValue: (v: string) => void
  baseId: string
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void
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
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const set = useCallback(
    (v: string) => {
      if (value === undefined) setInternal(v)
      onValueChange?.(v)
    },
    [value, onValueChange]
  )

  const registerTrigger = useCallback((v: string, el: HTMLButtonElement | null) => {
    if (el) triggerRefs.current.set(v, el)
    else triggerRefs.current.delete(v)
  }, [])

  return (
    <TabsContext.Provider value={{ value: active, setValue: set, baseId, registerTrigger }}>
      <TabsRefContext.Provider value={triggerRefs}>
        <div className={cn(styles.root, className)} {...rest}>
          {children}
        </div>
      </TabsRefContext.Provider>
    </TabsContext.Provider>
  )
}

const TabsRefContext = createContext<React.MutableRefObject<Map<string, HTMLButtonElement>> | null>(null)

export function TabsList({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const { value } = useTabs()
  const triggerRefs = useContext(TabsRefContext)
  const listRef = useRef<HTMLDivElement | null>(null)
  const [indicator, setIndicator] = useState<{ left: number; width: number; ready: boolean }>({
    left: 0,
    width: 0,
    ready: false,
  })

  const measure = useCallback(() => {
    const list = listRef.current
    const el = triggerRefs?.current.get(value)
    if (!list || !el) return
    const listRect = list.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setIndicator({ left: elRect.left - listRect.left, width: elRect.width, ready: true })
  }, [value, triggerRefs])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const handle = () => measure()
    window.addEventListener('resize', handle)
    const ro = new ResizeObserver(handle)
    if (listRef.current) ro.observe(listRef.current)
    triggerRefs?.current.forEach((el) => ro.observe(el))
    return () => {
      window.removeEventListener('resize', handle)
      ro.disconnect()
    }
  }, [measure, triggerRefs])

  return (
    <div
      ref={listRef}
      role="tablist"
      className={cn(styles.list, className)}
      {...rest}
    >
      {children}
      <span
        aria-hidden
        className={cn(styles.indicator, indicator.ready && styles.indicatorReady)}
        style={{
          transform: `translateX(${indicator.left}px)`,
          width: `${indicator.width}px`,
        }}
      />
    </div>
  )
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string
}

export function TabsTrigger({ value, className, children, ...rest }: TabsTriggerProps) {
  const { value: active, setValue, baseId, registerTrigger } = useTabs()
  const selected = active === value
  const ref = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    registerTrigger(value, ref.current)
    return () => registerTrigger(value, null)
  }, [value, registerTrigger])

  return (
    <button
      ref={ref}
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
      <span className={styles.triggerLabel}>{children}</span>
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
