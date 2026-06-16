import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

function renderSingle(props: Partial<React.ComponentProps<typeof ToggleGroup>> = {}) {
  return render(
    // @ts-expect-error narrowing handled by runtime props
    <ToggleGroup type="single" {...props}>
      <ToggleGroupItem value="left">Left</ToggleGroupItem>
      <ToggleGroupItem value="center">Center</ToggleGroupItem>
      <ToggleGroupItem value="right">Right</ToggleGroupItem>
    </ToggleGroup>
  )
}

describe('ToggleGroup', () => {
  it('renders a group role', () => {
    renderSingle()
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('single selection toggles aria-pressed exclusively', () => {
    renderSingle()
    const left = screen.getByRole('button', { name: 'Left' })
    const center = screen.getByRole('button', { name: 'Center' })
    fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(center)
    expect(center).toHaveAttribute('aria-pressed', 'true')
    expect(left).toHaveAttribute('aria-pressed', 'false')
  })

  it('single selection can be deselected by clicking again', () => {
    renderSingle()
    const left = screen.getByRole('button', { name: 'Left' })
    fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(left)
    expect(left).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onValueChange with a string in single mode', () => {
    const onValueChange = vi.fn()
    renderSingle({ onValueChange })
    fireEvent.click(screen.getByRole('button', { name: 'Center' }))
    expect(onValueChange).toHaveBeenCalledWith('center')
  })

  it('multiple selection allows several pressed items', () => {
    const onValueChange = vi.fn()
    render(
      <ToggleGroup type="multiple" onValueChange={onValueChange}>
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
      </ToggleGroup>
    )
    const bold = screen.getByRole('button', { name: 'Bold' })
    const italic = screen.getByRole('button', { name: 'Italic' })
    fireEvent.click(bold)
    fireEvent.click(italic)
    expect(bold).toHaveAttribute('aria-pressed', 'true')
    expect(italic).toHaveAttribute('aria-pressed', 'true')
    expect(onValueChange).toHaveBeenLastCalledWith(['bold', 'italic'])
  })

  it('respects defaultValue (uncontrolled)', () => {
    renderSingle({ defaultValue: 'center' })
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('applies roving tabindex: selected item is focusable, others -1', () => {
    renderSingle({ defaultValue: 'center' })
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('tabindex', '-1')
  })

  it('first item is focusable when nothing selected', () => {
    renderSingle()
    expect(screen.getByRole('button', { name: 'Left' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('button', { name: 'Center' })).toHaveAttribute('tabindex', '-1')
  })

  it('ArrowRight moves focus to the next item (horizontal)', () => {
    renderSingle()
    const left = screen.getByRole('button', { name: 'Left' })
    const center = screen.getByRole('button', { name: 'Center' })
    left.focus()
    fireEvent.keyDown(left, { key: 'ArrowRight' })
    expect(center).toHaveFocus()
  })

  it('ArrowLeft wraps to the last item', () => {
    renderSingle()
    const left = screen.getByRole('button', { name: 'Left' })
    const right = screen.getByRole('button', { name: 'Right' })
    left.focus()
    fireEvent.keyDown(left, { key: 'ArrowLeft' })
    expect(right).toHaveFocus()
  })

  it('Home/End move focus to first/last', () => {
    renderSingle()
    const left = screen.getByRole('button', { name: 'Left' })
    const right = screen.getByRole('button', { name: 'Right' })
    left.focus()
    fireEvent.keyDown(left, { key: 'End' })
    expect(right).toHaveFocus()
    fireEvent.keyDown(right, { key: 'Home' })
    expect(left).toHaveFocus()
  })

  it('vertical orientation uses ArrowDown/ArrowUp', () => {
    render(
      <ToggleGroup type="single" orientation="vertical">
        <ToggleGroupItem value="a">A</ToggleGroupItem>
        <ToggleGroupItem value="b">B</ToggleGroupItem>
      </ToggleGroup>
    )
    const a = screen.getByRole('button', { name: 'A' })
    const b = screen.getByRole('button', { name: 'B' })
    a.focus()
    fireEvent.keyDown(a, { key: 'ArrowDown' })
    expect(b).toHaveFocus()
  })

  it('disables all items when group is disabled', () => {
    renderSingle({ disabled: true })
    expect(screen.getByRole('button', { name: 'Left' })).toBeDisabled()
  })

  it('sets data-orientation on the group', () => {
    renderSingle({ orientation: 'vertical' })
    expect(screen.getByRole('group')).toHaveAttribute('data-orientation', 'vertical')
  })
})
