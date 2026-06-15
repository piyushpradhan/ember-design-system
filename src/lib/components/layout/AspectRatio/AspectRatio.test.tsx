import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AspectRatio } from './AspectRatio'

describe('AspectRatio', () => {
  it('renders a div with children', () => {
    const { container } = render(
      <AspectRatio data-testid="ar">
        <span>child</span>
      </AspectRatio>
    )
    expect(container.firstElementChild?.tagName).toBe('DIV')
    expect(screen.getByText('child')).toBeInTheDocument()
  })

  it('defaults to 16/9 ratio', () => {
    render(<AspectRatio data-testid="ar" />)
    const el = screen.getByTestId('ar')
    expect(el.style.getPropertyValue('--ar-ratio')).toBe(String(16 / 9))
  })

  it('applies a custom ratio', () => {
    render(<AspectRatio data-testid="ar" ratio={1} />)
    const el = screen.getByTestId('ar')
    expect(el.style.getPropertyValue('--ar-ratio')).toBe('1')
    expect(el.style.getPropertyValue('--ar-padding')).toBe('100%')
  })

  it('computes the padding fallback for non-square ratios', () => {
    render(<AspectRatio data-testid="ar" ratio={2} />)
    const el = screen.getByTestId('ar')
    expect(el.style.getPropertyValue('--ar-padding')).toBe('50%')
  })

  it('falls back to 16/9 for invalid ratios', () => {
    render(<AspectRatio data-testid="ar" ratio={0} />)
    const el = screen.getByTestId('ar')
    expect(el.style.getPropertyValue('--ar-ratio')).toBe(String(16 / 9))
  })

  it('merges user style without dropping ratio vars', () => {
    render(<AspectRatio data-testid="ar" ratio={1} style={{ maxWidth: 200 }} />)
    const el = screen.getByTestId('ar')
    expect(el.style.maxWidth).toBe('200px')
    expect(el.style.getPropertyValue('--ar-ratio')).toBe('1')
  })

  it('merges custom className', () => {
    render(<AspectRatio data-testid="ar" className="custom" />)
    expect(screen.getByTestId('ar')).toHaveClass('custom')
  })

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null
    render(<AspectRatio ref={(el) => { ref = el }} />)
    expect(ref).not.toBeNull()
    expect(ref!.tagName).toBe('DIV')
  })
})
