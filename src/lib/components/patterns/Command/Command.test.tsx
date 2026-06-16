import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
} from './Command'

function Example({ onSelect }: { onSelect?: (value: string) => void }) {
  return (
    <Command onSelect={onSelect}>
      <CommandInput placeholder="Search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem value="apple">Apple</CommandItem>
        <CommandItem value="banana">Banana</CommandItem>
        <CommandItem value="cherry">Cherry</CommandItem>
      </CommandList>
    </Command>
  )
}

describe('Command', () => {
  it('renders the listbox and option roles', () => {
    render(<Example />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option')).toHaveLength(3)
  })

  it('filters items as the user types', () => {
    render(<Example />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'an' } })
    // "Banana" matches "an"; "Apple" and "Cherry" do not.
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(1)
    expect(options[0]).toHaveTextContent('Banana')
  })

  it('shows CommandEmpty when nothing matches', () => {
    render(<Example />)
    const input = screen.getByRole('combobox')
    fireEvent.change(input, { target: { value: 'zzz' } })
    expect(screen.queryAllByRole('option')).toHaveLength(0)
    expect(screen.getByText('No results found.')).toBeInTheDocument()
  })

  it('highlights with ArrowDown and selects with Enter', () => {
    const onSelect = vi.fn()
    render(<Example onSelect={onSelect} />)
    const input = screen.getByRole('combobox')
    // First item is active by default; ArrowDown moves to the second.
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    fireEvent.keyDown(input, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('banana')
  })

  it('fires onSelect when an item is clicked', () => {
    const onSelect = vi.fn()
    render(<Example onSelect={onSelect} />)
    fireEvent.click(screen.getByText('Cherry'))
    expect(onSelect).toHaveBeenCalledWith('cherry')
  })

  it('marks the active option with aria-selected', () => {
    render(<Example />)
    const input = screen.getByRole('combobox')
    const options = screen.getAllByRole('option')
    // Default active is the first option.
    expect(options[0]).toHaveAttribute('aria-selected', 'true')
    fireEvent.keyDown(input, { key: 'ArrowDown' })
    expect(screen.getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true')
  })
})
