import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import { Combobox, type ComboboxOption } from './Combobox'

const options: ComboboxOption[] = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Grape (out of stock)', value: 'grape', disabled: true },
]

function getTrigger() {
  return screen.getByRole('combobox')
}

describe('Combobox', () => {
  it('shows the placeholder when nothing is selected', () => {
    render(<Combobox options={options} placeholder="Pick a fruit" />)
    expect(getTrigger()).toHaveTextContent('Pick a fruit')
  })

  it('shows the selected label for a controlled value', () => {
    render(<Combobox options={options} value="banana" />)
    expect(getTrigger()).toHaveTextContent('Banana')
  })

  it('sets role=combobox with aria-expanded and toggles it open', () => {
    render(<Combobox options={options} />)
    const trigger = getTrigger()
    expect(trigger).toHaveAttribute('role', 'combobox')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
    // aria-controls points at the open popup, which contains the listbox.
    const controls = trigger.getAttribute('aria-controls')
    expect(controls).toBeTruthy()
    const popup = document.getElementById(controls as string)
    expect(popup).not.toBeNull()
    expect(within(popup as HTMLElement).getByRole('listbox')).toBeInTheDocument()
  })

  it('opens the panel and lists the options', () => {
    render(<Combobox options={options} />)
    fireEvent.click(getTrigger())
    const listbox = screen.getByRole('listbox')
    expect(within(listbox).getAllByRole('option')).toHaveLength(4)
  })

  it('filters options as the user types', () => {
    render(<Combobox options={options} />)
    fireEvent.click(getTrigger())
    const search = screen.getByPlaceholderText('Search…')
    fireEvent.change(search, { target: { value: 'an' } })
    const options_ = screen.getAllByRole('option')
    expect(options_).toHaveLength(1)
    expect(options_[0]).toHaveTextContent('Banana')
  })

  it('shows the empty text when nothing matches', () => {
    render(<Combobox options={options} emptyText="Nothing here." />)
    fireEvent.click(getTrigger())
    const search = screen.getByPlaceholderText('Search…')
    fireEvent.change(search, { target: { value: 'zzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('Nothing here.')).toBeInTheDocument()
  })

  it('selects on click, updates the trigger and closes', () => {
    const onChange = vi.fn()
    render(<Combobox options={options} onChange={onChange} />)
    const trigger = getTrigger()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByText('Cherry'))
    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(trigger).toHaveTextContent('Cherry')
  })

  it('selects with ArrowDown + Enter keyboard navigation', () => {
    const onChange = vi.fn()
    render(<Combobox options={options} onChange={onChange} />)
    fireEvent.click(getTrigger())
    const search = screen.getByPlaceholderText('Search…')
    // First option active by default; ArrowDown highlights the second.
    fireEvent.keyDown(search, { key: 'ArrowDown' })
    fireEvent.keyDown(search, { key: 'Enter' })
    expect(onChange).toHaveBeenCalledWith('banana')
  })

  it('closes on Escape', () => {
    render(<Combobox options={options} />)
    fireEvent.click(getTrigger())
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('does not open when disabled', () => {
    render(<Combobox options={options} disabled />)
    const trigger = getTrigger()
    expect(trigger).toBeDisabled()
    fireEvent.click(trigger)
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })
})
