import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Calendar, type DateRange } from './Calendar'

const JAN_2024 = new Date(2024, 0, 15)

describe('Calendar', () => {
  it('renders the visible month caption and a grid', () => {
    render(<Calendar defaultMonth={JAN_2024} />)
    expect(screen.getByText('January 2024')).toBeInTheDocument()
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('renders weekday column headers', () => {
    render(<Calendar defaultMonth={JAN_2024} />)
    expect(screen.getAllByRole('columnheader')).toHaveLength(7)
  })

  it('navigates to the next and previous month', () => {
    render(<Calendar defaultMonth={JAN_2024} />)
    fireEvent.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('February 2024')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText('Previous month'))
    fireEvent.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('December 2023')).toBeInTheDocument()
  })

  it('fires onSelect with the chosen date in single mode', () => {
    const onSelect = vi.fn()
    render(<Calendar defaultMonth={JAN_2024} onSelect={onSelect} />)
    const cell = screen.getByLabelText('Wednesday, January 10, 2024')
    fireEvent.click(cell)
    expect(onSelect).toHaveBeenCalledTimes(1)
    const arg = onSelect.mock.calls[0][0] as Date
    expect(arg.getFullYear()).toBe(2024)
    expect(arg.getMonth()).toBe(0)
    expect(arg.getDate()).toBe(10)
  })

  it('marks the selected day with aria-selected', () => {
    render(<Calendar defaultMonth={JAN_2024} selected={new Date(2024, 0, 10)} />)
    expect(screen.getByLabelText('Wednesday, January 10, 2024')).toHaveAttribute(
      'aria-selected',
      'true'
    )
  })

  it('disables days rejected by the disabled predicate and does not select them', () => {
    const onSelect = vi.fn()
    const isTenth = (d: Date) => d.getDate() === 10
    render(<Calendar defaultMonth={JAN_2024} disabled={isTenth} onSelect={onSelect} />)
    const cell = screen.getByLabelText('Wednesday, January 10, 2024')
    expect(cell).toBeDisabled()
    fireEvent.click(cell)
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('respects fromDate / toDate bounds', () => {
    render(
      <Calendar
        defaultMonth={JAN_2024}
        fromDate={new Date(2024, 0, 5)}
        toDate={new Date(2024, 0, 20)}
      />
    )
    expect(screen.getByLabelText('Wednesday, January 3, 2024')).toBeDisabled()
    expect(screen.getByLabelText('Tuesday, January 30, 2024')).toBeDisabled()
    expect(screen.getByLabelText('Wednesday, January 10, 2024')).not.toBeDisabled()
  })

  it('moves focus with arrow keys', () => {
    render(<Calendar defaultMonth={JAN_2024} selected={new Date(2024, 0, 10)} />)
    const grid = screen.getByRole('grid')
    const start = screen.getByLabelText('Wednesday, January 10, 2024')
    start.focus()
    fireEvent.keyDown(grid, { key: 'ArrowRight' })
    expect(screen.getByLabelText('Thursday, January 11, 2024')).toHaveAttribute('tabindex', '0')
    fireEvent.keyDown(grid, { key: 'ArrowDown' })
    expect(screen.getByLabelText('Thursday, January 18, 2024')).toHaveAttribute('tabindex', '0')
  })

  it('changes month with PageDown/PageUp keys', () => {
    render(<Calendar defaultMonth={JAN_2024} selected={new Date(2024, 0, 10)} />)
    const grid = screen.getByRole('grid')
    screen.getByLabelText('Wednesday, January 10, 2024').focus()
    fireEvent.keyDown(grid, { key: 'PageDown' })
    expect(screen.getByText('February 2024')).toBeInTheDocument()
  })

  it('selects via keyboard with Enter', () => {
    const onSelect = vi.fn()
    render(<Calendar defaultMonth={JAN_2024} selected={new Date(2024, 0, 10)} onSelect={onSelect} />)
    const grid = screen.getByRole('grid')
    screen.getByLabelText('Wednesday, January 10, 2024').focus()
    fireEvent.keyDown(grid, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalled()
  })

  it('toggles selection in multiple mode', () => {
    const onSelect = vi.fn()
    render(<Calendar mode="multiple" defaultMonth={JAN_2024} selected={[]} onSelect={onSelect} />)
    fireEvent.click(screen.getByLabelText('Wednesday, January 10, 2024'))
    const arg = onSelect.mock.calls[0][0] as Date[]
    expect(arg).toHaveLength(1)
    expect(arg[0].getDate()).toBe(10)
  })

  it('builds a range across two clicks', () => {
    const onSelect = vi.fn()
    function Demo() {
      return <Calendar mode="range" defaultMonth={JAN_2024} selected={{}} onSelect={onSelect} />
    }
    const { rerender } = render(<Demo />)
    fireEvent.click(screen.getByLabelText('Wednesday, January 10, 2024'))
    expect((onSelect.mock.calls[0][0] as DateRange).from?.getDate()).toBe(10)
    rerender(
      <Calendar
        mode="range"
        defaultMonth={JAN_2024}
        selected={{ from: new Date(2024, 0, 10) }}
        onSelect={onSelect}
      />
    )
    fireEvent.click(screen.getByLabelText('Saturday, January 13, 2024'))
    const range = onSelect.mock.calls[1][0] as DateRange
    expect(range.from?.getDate()).toBe(10)
    expect(range.to?.getDate()).toBe(13)
  })

  it('marks today with aria-current', () => {
    render(<Calendar defaultMonth={new Date()} />)
    const grid = screen.getByRole('grid')
    const today = new Date()
    const cell = within(grid).getByLabelText(
      new RegExp(`${today.getDate()}, ${today.getFullYear()}`)
    )
    expect(cell).toHaveAttribute('aria-current', 'date')
  })
})
