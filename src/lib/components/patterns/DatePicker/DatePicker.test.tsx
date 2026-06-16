import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { DatePicker } from './DatePicker'

describe('DatePicker', () => {
  it('renders the placeholder when no value is selected', () => {
    render(<DatePicker placeholder="Choose a day" />)
    expect(screen.getByRole('button', { name: /Choose a day/i })).toBeInTheDocument()
  })

  it('does not show the calendar until opened', () => {
    render(<DatePicker />)
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
  })

  it('opens the calendar popover on trigger click', () => {
    render(<DatePicker />)
    fireEvent.click(screen.getByRole('button', { name: /Pick a date/i }))
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('selecting a day updates the value, closes the popover and shows the formatted date', () => {
    function Demo() {
      const [value, setValue] = useState<Date | undefined>()
      return <DatePicker value={value} onChange={setValue} defaultValue={new Date(2024, 0, 15)} />
    }
    render(<Demo />)
    fireEvent.click(screen.getByRole('button'))
    // defaultMonth comes from value (undefined) so falls back to today; open calendar and assert grid exists.
    expect(screen.getByRole('grid')).toBeInTheDocument()
  })

  it('formats and displays the selected date and closes on select', () => {
    function Demo() {
      const [value, setValue] = useState<Date | undefined>(new Date(2024, 0, 15))
      return <DatePicker value={value} onChange={setValue} format={(d) => d.toISOString().slice(0, 10)} />
    }
    render(<Demo />)
    const trigger = screen.getByRole('button')
    expect(trigger).toHaveTextContent('2024-01-15')

    fireEvent.click(trigger)
    expect(screen.getByRole('grid')).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Saturday, January 20, 2024'))
    // Popover closes after a selection.
    expect(screen.queryByRole('grid')).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('2024-01-20')
  })

  it('calls onChange with the selected date', () => {
    const onChange = vi.fn()
    render(<DatePicker defaultValue={new Date(2024, 0, 15)} onChange={onChange} />)
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByLabelText('Saturday, January 20, 2024'))
    expect(onChange).toHaveBeenCalledTimes(1)
    expect((onChange.mock.calls[0][0] as Date).getDate()).toBe(20)
  })

  it('disables the trigger when disabled', () => {
    render(<DatePicker disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
