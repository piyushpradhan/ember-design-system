import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
} from 'react'
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react'
import { cn } from '../../../utils/cn'
import { IconButton } from '../../primitives/IconButton'
import styles from './Carousel.module.css'

export type CarouselOrientation = 'horizontal' | 'vertical'

interface CarouselContextValue {
  orientation: CarouselOrientation
  loop: boolean
  canScrollPrev: boolean
  canScrollNext: boolean
  scrollPrev: () => void
  scrollNext: () => void
  registerViewport: (node: HTMLDivElement | null) => void
}

const CarouselContext = createContext<CarouselContextValue | null>(null)

function useCarousel(component: string): CarouselContextValue {
  const ctx = useContext(CarouselContext)
  if (!ctx) {
    throw new Error(`<${component}> must be used within <Carousel>`)
  }
  return ctx
}

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: CarouselOrientation
  /** Wrap from the last item back to the first (and vice versa). */
  loop?: boolean
}

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  { orientation = 'horizontal', loop = false, className, children, onKeyDown, ...rest },
  ref
) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const isHorizontal = orientation === 'horizontal'

  const updateScrollState = useCallback(() => {
    const el = viewportRef.current
    if (!el) return
    if (loop) {
      const hasItems = el.children.length > 0
      setCanScrollPrev(hasItems)
      setCanScrollNext(hasItems)
      return
    }
    if (isHorizontal) {
      const max = el.scrollWidth - el.clientWidth
      setCanScrollPrev(el.scrollLeft > 1)
      setCanScrollNext(el.scrollLeft < max - 1)
    } else {
      const max = el.scrollHeight - el.clientHeight
      setCanScrollPrev(el.scrollTop > 1)
      setCanScrollNext(el.scrollTop < max - 1)
    }
  }, [isHorizontal, loop])

  const registerViewport = useCallback(
    (node: HTMLDivElement | null) => {
      viewportRef.current = node
      // Compute initial state once the viewport is mounted.
      updateScrollState()
    },
    [updateScrollState]
  )

  const stepTo = useCallback(
    (direction: 1 | -1) => {
      const el = viewportRef.current
      if (!el) return
      const items = Array.from(el.children) as HTMLElement[]
      if (items.length === 0) return

      // Find the item nearest the current scroll start.
      const pos = isHorizontal ? el.scrollLeft : el.scrollTop
      let currentIndex = 0
      let best = Infinity
      items.forEach((item, i) => {
        const offset = isHorizontal ? item.offsetLeft : item.offsetTop
        const dist = Math.abs(offset - pos)
        if (dist < best) {
          best = dist
          currentIndex = i
        }
      })

      let nextIndex = currentIndex + direction
      if (loop) {
        nextIndex = (nextIndex + items.length) % items.length
      } else {
        nextIndex = Math.max(0, Math.min(items.length - 1, nextIndex))
      }
      const target = items[nextIndex]
      // jsdom lacks scrollIntoView; guard it.
      target?.scrollIntoView?.({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
      // Fall back to scrollBy when scrollIntoView is unavailable.
      if (!target?.scrollIntoView) {
        const size = isHorizontal ? el.clientWidth : el.clientHeight
        el.scrollBy?.({
          left: isHorizontal ? size * direction : 0,
          top: isHorizontal ? 0 : size * direction,
          behavior: 'smooth',
        })
      }
      updateScrollState()
    },
    [isHorizontal, loop, updateScrollState]
  )

  const scrollPrev = useCallback(() => stepTo(-1), [stepTo])
  const scrollNext = useCallback(() => stepTo(1), [stepTo])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    return () => el.removeEventListener('scroll', updateScrollState)
  }, [updateScrollState])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e)
      const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp'
      const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown'
      if (e.key === prevKey) {
        e.preventDefault()
        scrollPrev()
      } else if (e.key === nextKey) {
        e.preventDefault()
        scrollNext()
      }
    },
    [isHorizontal, scrollPrev, scrollNext, onKeyDown]
  )

  const value = useMemo<CarouselContextValue>(
    () => ({
      orientation,
      loop,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
      registerViewport,
    }),
    [orientation, loop, canScrollPrev, canScrollNext, scrollPrev, scrollNext, registerViewport]
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        ref={ref}
        role="region"
        aria-roledescription="carousel"
        className={cn(styles.root, className)}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  )
})

export type CarouselContentProps = HTMLAttributes<HTMLDivElement>

export const CarouselContent = forwardRef<HTMLDivElement, CarouselContentProps>(
  function CarouselContent({ className, children, ...rest }, ref) {
    const ctx = useCarousel('CarouselContent')

    const setViewport = useCallback(
      (node: HTMLDivElement | null) => {
        ctx.registerViewport(node)
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      },
      [ctx, ref]
    )

    return (
      <div
        ref={setViewport}
        className={cn(
          styles.viewport,
          ctx.orientation === 'vertical' ? styles.vertical : styles.horizontal,
          className
        )}
        {...rest}
      >
        {children}
      </div>
    )
  }
)

export type CarouselItemProps = HTMLAttributes<HTMLDivElement>

export const CarouselItem = forwardRef<HTMLDivElement, CarouselItemProps>(function CarouselItem(
  { className, ...rest },
  ref
) {
  return (
    <div
      ref={ref}
      role="group"
      aria-roledescription="slide"
      className={cn(styles.item, className)}
      {...rest}
    />
  )
})

export interface CarouselPreviousProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  'aria-label'?: string
}

export const CarouselPrevious = forwardRef<HTMLButtonElement, CarouselPreviousProps>(
  function CarouselPrevious({ className, 'aria-label': ariaLabel = 'Previous slide', ...rest }, ref) {
    const ctx = useCarousel('CarouselPrevious')
    const isHorizontal = ctx.orientation === 'horizontal'
    return (
      <IconButton
        ref={ref}
        variant="secondary"
        aria-label={ariaLabel}
        className={cn(styles.control, styles.prev, className)}
        {...rest}
        disabled={!ctx.canScrollPrev}
        onClick={ctx.scrollPrev}
        icon={isHorizontal ? <ChevronLeft size={16} /> : <ChevronUp size={16} />}
      />
    )
  }
)

export interface CarouselNextProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  'aria-label'?: string
}

export const CarouselNext = forwardRef<HTMLButtonElement, CarouselNextProps>(function CarouselNext(
  { className, 'aria-label': ariaLabel = 'Next slide', ...rest },
  ref
) {
  const ctx = useCarousel('CarouselNext')
  const isHorizontal = ctx.orientation === 'horizontal'
  return (
    <IconButton
      ref={ref}
      variant="secondary"
      aria-label={ariaLabel}
      className={cn(styles.control, styles.next, className)}
      {...rest}
      disabled={!ctx.canScrollNext}
      onClick={ctx.scrollNext}
      icon={isHorizontal ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
    />
  )
})
