import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Slider } from './Slider'

describe('Slider', () => {
  it('renders a single slider thumb with aria attributes', () => {
    render(<Slider defaultValue={40} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    expect(thumb).toHaveAttribute('aria-valuemin', '0')
    expect(thumb).toHaveAttribute('aria-valuemax', '100')
    expect(thumb).toHaveAttribute('aria-valuenow', '40')
    expect(thumb).toHaveAttribute('aria-label', 'Volume')
  })

  it('renders one thumb per value in range mode', () => {
    render(<Slider defaultValue={[20, 70]} aria-label="Range" />)
    const thumbs = screen.getAllByRole('slider')
    expect(thumbs).toHaveLength(2)
    expect(thumbs[0]).toHaveAttribute('aria-valuenow', '20')
    expect(thumbs[1]).toHaveAttribute('aria-valuenow', '70')
  })

  it('ArrowRight increases value by step', () => {
    render(<Slider defaultValue={40} step={1} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(thumb).toHaveAttribute('aria-valuenow', '41')
  })

  it('ArrowLeft decreases value by step', () => {
    render(<Slider defaultValue={40} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowLeft' })
    expect(thumb).toHaveAttribute('aria-valuenow', '39')
  })

  it('respects a custom step', () => {
    render(<Slider defaultValue={40} step={5} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(thumb).toHaveAttribute('aria-valuenow', '45')
  })

  it('Home/End jump to min/max', () => {
    render(<Slider defaultValue={40} min={0} max={100} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'End' })
    expect(thumb).toHaveAttribute('aria-valuenow', '100')
    fireEvent.keyDown(thumb, { key: 'Home' })
    expect(thumb).toHaveAttribute('aria-valuenow', '0')
  })

  it('PageUp/PageDown move by 10x step', () => {
    render(<Slider defaultValue={40} step={2} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'PageUp' })
    expect(thumb).toHaveAttribute('aria-valuenow', '60')
    fireEvent.keyDown(thumb, { key: 'PageDown' })
    expect(thumb).toHaveAttribute('aria-valuenow', '40')
  })

  it('clamps at the maximum', () => {
    render(<Slider defaultValue={99} max={100} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'PageUp' })
    expect(thumb).toHaveAttribute('aria-valuenow', '100')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(thumb).toHaveAttribute('aria-valuenow', '100')
  })

  it('thumbs cannot cross each other in range mode', () => {
    render(<Slider defaultValue={[40, 50]} aria-label="Range" />)
    const [lower] = screen.getAllByRole('slider')
    // Push lower thumb far past the upper thumb's value.
    fireEvent.keyDown(lower, { key: 'End' })
    // It is clamped to the upper thumb (50), not max.
    expect(lower).toHaveAttribute('aria-valuenow', '50')
  })

  it('calls onValueChange with a number in single mode', () => {
    const onValueChange = vi.fn()
    render(<Slider defaultValue={40} onValueChange={onValueChange} aria-label="Volume" />)
    fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenCalledWith(41)
  })

  it('calls onValueChange with an array in range mode', () => {
    const onValueChange = vi.fn()
    render(
      <Slider defaultValue={[20, 70]} onValueChange={onValueChange} aria-label="Range" />
    )
    const [lower] = screen.getAllByRole('slider')
    fireEvent.keyDown(lower, { key: 'ArrowRight' })
    expect(onValueChange).toHaveBeenCalledWith([21, 70])
  })

  it('is controlled: stays put without prop update but still notifies', () => {
    const onValueChange = vi.fn()
    render(<Slider value={40} onValueChange={onValueChange} aria-label="Volume" />)
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(thumb).toHaveAttribute('aria-valuenow', '40')
    expect(onValueChange).toHaveBeenCalledWith(41)
  })

  it('does not respond to keys when disabled', () => {
    const onValueChange = vi.fn()
    render(
      <Slider defaultValue={40} disabled onValueChange={onValueChange} aria-label="Volume" />
    )
    const thumb = screen.getByRole('slider')
    fireEvent.keyDown(thumb, { key: 'ArrowRight' })
    expect(thumb).toHaveAttribute('aria-valuenow', '40')
    expect(onValueChange).not.toHaveBeenCalled()
    expect(thumb).toHaveAttribute('tabindex', '-1')
  })

  it('exposes orientation on the thumb', () => {
    render(<Slider defaultValue={40} orientation="vertical" aria-label="Volume" />)
    expect(screen.getByRole('slider')).toHaveAttribute('aria-orientation', 'vertical')
  })
})
