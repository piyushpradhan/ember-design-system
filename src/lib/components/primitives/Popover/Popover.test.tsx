import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'

function Example() {
  return (
    <Popover>
      <PopoverTrigger>
        <button>Open</button>
      </PopoverTrigger>
      <PopoverContent>
        <div>Panel content</div>
        <PopoverClose>Dismiss</PopoverClose>
      </PopoverContent>
    </Popover>
  )
}

describe('Popover', () => {
  it('is closed by default', () => {
    render(<Example />)
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
  })

  it('opens when the trigger is clicked', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByText('Panel content')).toBeInTheDocument()
  })

  it('sets aria-expanded on the trigger', () => {
    render(<Example />)
    const trigger = screen.getByText('Open')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes via PopoverClose', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByText('Dismiss'))
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
  })

  it('closes on Escape', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
  })

  it('closes on outside pointer press', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.pointerDown(document.body)
    expect(screen.queryByText('Panel content')).not.toBeInTheDocument()
  })
})
