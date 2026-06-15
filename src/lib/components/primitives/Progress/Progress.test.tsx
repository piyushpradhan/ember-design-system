import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders a progressbar', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria value attributes for a determinate bar', () => {
    render(<Progress value={30} max={100} />)
    const el = screen.getByRole('progressbar')
    expect(el).toHaveAttribute('aria-valuenow', '30')
    expect(el).toHaveAttribute('aria-valuemin', '0')
    expect(el).toHaveAttribute('aria-valuemax', '100')
  })

  it('respects a custom max', () => {
    render(<Progress value={5} max={10} />)
    const el = screen.getByRole('progressbar')
    expect(el).toHaveAttribute('aria-valuemax', '10')
    expect(el).toHaveAttribute('aria-valuenow', '5')
  })

  it('clamps values above max', () => {
    render(<Progress value={150} max={100} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('clamps negative values to zero', () => {
    render(<Progress value={-20} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('applies the indeterminate class', () => {
    render(<Progress indeterminate />)
    expect(screen.getByRole('progressbar')).toHaveClass(/indeterminate/)
  })

  it('exposes the fill percentage as a custom property', () => {
    render(<Progress value={25} max={100} />)
    const el = screen.getByRole('progressbar')
    expect(el.style.getPropertyValue('--progress-percent')).toBe('25%')
  })

  it('computes percentage relative to max', () => {
    render(<Progress value={1} max={4} />)
    const el = screen.getByRole('progressbar')
    expect(el.style.getPropertyValue('--progress-percent')).toBe('25%')
  })

  it('defaults to the md size', () => {
    render(<Progress value={10} />)
    expect(screen.getByRole('progressbar')).toHaveClass(/size-md/)
  })

  it('applies the sm size class', () => {
    render(<Progress value={10} size="sm" />)
    expect(screen.getByRole('progressbar')).toHaveClass(/size-sm/)
  })

  it('supports an aria-label', () => {
    render(<Progress value={10} aria-label="Download" />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-label', 'Download')
  })

  it('falls back to a sane max when given an invalid one', () => {
    render(<Progress value={50} max={0} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '100')
  })

  it('merges custom className', () => {
    render(<Progress value={10} className="custom" />)
    expect(screen.getByRole('progressbar')).toHaveClass('custom')
  })

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null
    render(<Progress value={10} ref={(el) => { ref = el }} />)
    expect(ref).not.toBeNull()
    expect(ref!.tagName).toBe('DIV')
  })
})
