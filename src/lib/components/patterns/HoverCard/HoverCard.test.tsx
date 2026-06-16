import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { act, render, screen, fireEvent } from '@testing-library/react'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'

function Example({ openDelay = 200, closeDelay = 150 }: { openDelay?: number; closeDelay?: number }) {
  return (
    <HoverCard openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger>
        <button>Trigger</button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div>Card content</div>
      </HoverCardContent>
    </HoverCard>
  )
}

describe('HoverCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('is closed by default', () => {
    render(<Example />)
    expect(screen.queryByText('Card content')).not.toBeInTheDocument()
  })

  it('opens on mouseenter after the open delay', () => {
    render(<Example openDelay={200} />)
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    // Not open before the delay elapses.
    act(() => {
      vi.advanceTimersByTime(199)
    })
    expect(screen.queryByText('Card content')).not.toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('opens on focus and closes on blur after the close delay', () => {
    render(<Example openDelay={0} closeDelay={150} />)
    fireEvent.focus(screen.getByText('Trigger'))
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(screen.getByText('Card content')).toBeInTheDocument()

    fireEvent.blur(screen.getByText('Trigger'))
    act(() => {
      vi.advanceTimersByTime(149)
    })
    expect(screen.getByText('Card content')).toBeInTheDocument()
    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(screen.queryByText('Card content')).not.toBeInTheDocument()
  })

  it('stays open when the pointer moves onto the content', () => {
    render(<Example openDelay={0} closeDelay={150} />)
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    act(() => {
      vi.advanceTimersByTime(0)
    })
    // Leaving the trigger schedules a close...
    fireEvent.mouseLeave(screen.getByText('Trigger'))
    // ...but entering the content cancels it.
    fireEvent.mouseEnter(screen.getByText('Card content'))
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('closes on Escape immediately', () => {
    render(<Example openDelay={0} />)
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(screen.getByText('Card content')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Card content')).not.toBeInTheDocument()
  })

  it('sets aria attributes on the trigger', () => {
    render(<Example openDelay={0} />)
    const trigger = screen.getByText('Trigger')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.mouseEnter(trigger)
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    expect(trigger).toHaveAttribute('aria-controls')
  })

  it('exposes the content as a dialog role', () => {
    render(<Example openDelay={0} />)
    fireEvent.mouseEnter(screen.getByText('Trigger'))
    act(() => {
      vi.advanceTimersByTime(0)
    })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
