import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Toggle } from './Toggle'

describe('Toggle', () => {
  it('renders a button with aria-pressed false by default', () => {
    render(<Toggle>Bold</Toggle>)
    const btn = screen.getByRole('button', { name: 'Bold' })
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles aria-pressed when clicked (uncontrolled)', () => {
    render(<Toggle>Bold</Toggle>)
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('respects defaultPressed', () => {
    render(<Toggle defaultPressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onPressedChange with the next value', () => {
    const onPressedChange = vi.fn()
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>)
    fireEvent.click(screen.getByRole('button'))
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('is controlled: does not change without prop update', () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle pressed={false} onPressedChange={onPressedChange}>
        Bold
      </Toggle>
    )
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    expect(onPressedChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle when disabled', () => {
    const onPressedChange = vi.fn()
    render(
      <Toggle disabled onPressedChange={onPressedChange}>
        Bold
      </Toggle>
    )
    const btn = screen.getByRole('button')
    fireEvent.click(btn)
    expect(onPressedChange).not.toHaveBeenCalled()
    expect(btn).toBeDisabled()
  })

  it('sets data-state attribute', () => {
    render(<Toggle defaultPressed>Bold</Toggle>)
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'on')
  })
})
