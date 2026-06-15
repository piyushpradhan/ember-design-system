import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders a presentational div', () => {
    const { container } = render(<Skeleton data-testid="sk" />)
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('is hidden from the accessibility tree', () => {
    render(<Skeleton data-testid="sk" />)
    const el = screen.getByTestId('sk')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el).toHaveAttribute('role', 'presentation')
  })

  it('defaults to the rect variant', () => {
    render(<Skeleton data-testid="sk" />)
    expect(screen.getByTestId('sk')).toHaveClass(/variant-rect/)
  })

  it('applies the requested variant class', () => {
    render(<Skeleton data-testid="sk" variant="circle" />)
    expect(screen.getByTestId('sk')).toHaveClass(/variant-circle/)
  })

  it('converts numeric width/height to px', () => {
    render(<Skeleton data-testid="sk" width={100} height={20} />)
    const el = screen.getByTestId('sk')
    expect(el.style.width).toBe('100px')
    expect(el.style.height).toBe('20px')
  })

  it('passes string width/height through unchanged', () => {
    render(<Skeleton data-testid="sk" width="50%" height="2em" />)
    const el = screen.getByTestId('sk')
    expect(el.style.width).toBe('50%')
    expect(el.style.height).toBe('2em')
  })

  it('applies a numeric radius as px', () => {
    render(<Skeleton data-testid="sk" radius={8} />)
    expect(screen.getByTestId('sk').style.borderRadius).toBe('8px')
  })

  it('does not set sizing styles when no props given', () => {
    render(<Skeleton data-testid="sk" />)
    const el = screen.getByTestId('sk')
    expect(el.style.width).toBe('')
    expect(el.style.height).toBe('')
  })

  it('merges custom style without dropping dimensions', () => {
    render(<Skeleton data-testid="sk" width={40} style={{ opacity: '0.5' }} />)
    const el = screen.getByTestId('sk')
    expect(el.style.width).toBe('40px')
    expect(el.style.opacity).toBe('0.5')
  })

  it('merges custom className', () => {
    render(<Skeleton data-testid="sk" className="custom" />)
    expect(screen.getByTestId('sk')).toHaveClass('custom')
  })

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null
    render(<Skeleton ref={(el) => { ref = el }} />)
    expect(ref).not.toBeNull()
    expect(ref!.tagName).toBe('DIV')
  })
})
