import { describe, it, expect } from 'vitest'
import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import { ScrollArea } from './ScrollArea'

describe('ScrollArea', () => {
  it('renders children inside the viewport', () => {
    render(<ScrollArea>content here</ScrollArea>)
    expect(screen.getByText('content here')).toBeInTheDocument()
  })

  it('defaults to vertical orientation', () => {
    const { container } = render(<ScrollArea>x</ScrollArea>)
    const viewport = container.firstElementChild as HTMLElement
    expect(viewport).toHaveAttribute('data-orientation', 'vertical')
  })

  it('reflects the orientation prop', () => {
    const { container } = render(<ScrollArea orientation="both">x</ScrollArea>)
    expect(container.firstElementChild).toHaveAttribute('data-orientation', 'both')
  })

  it('is focusable for keyboard scrolling', () => {
    const { container } = render(<ScrollArea>x</ScrollArea>)
    expect(container.firstElementChild).toHaveAttribute('tabindex', '0')
  })

  it('applies numeric maxHeight as pixels', () => {
    const { container } = render(<ScrollArea maxHeight={150}>x</ScrollArea>)
    expect(container.firstElementChild).toHaveStyle({ maxHeight: '150px' })
  })

  it('applies string maxHeight verbatim', () => {
    const { container } = render(<ScrollArea maxHeight="50vh">x</ScrollArea>)
    expect(container.firstElementChild).toHaveStyle({ maxHeight: '50vh' })
  })

  it('forwards the ref to the viewport element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<ScrollArea ref={ref}>x</ScrollArea>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveAttribute('data-orientation', 'vertical')
  })

  it('merges a custom className and spreads div attributes', () => {
    const { container } = render(
      <ScrollArea className="custom" aria-label="releases">
        x
      </ScrollArea>
    )
    const viewport = container.firstElementChild as HTMLElement
    expect(viewport.className).toContain('custom')
    expect(viewport).toHaveAttribute('aria-label', 'releases')
  })

  it('merges consumer style with the resolved maxHeight', () => {
    const { container } = render(
      <ScrollArea maxHeight={120} style={{ width: 200 }}>
        x
      </ScrollArea>
    )
    expect(container.firstElementChild).toHaveStyle({ maxHeight: '120px', width: '200px' })
  })
})
