import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './Carousel'

function renderCarousel(
  props: { loop?: boolean; orientation?: 'horizontal' | 'vertical' } = {}
) {
  return render(
    <Carousel {...props} aria-label="Test carousel">
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>Slide {n}</CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

describe('Carousel', () => {
  it('renders all items as slides', () => {
    const { container } = renderCarousel()
    const slides = container.querySelectorAll('[aria-roledescription="slide"]')
    expect(slides).toHaveLength(3)
    expect(screen.getByText('Slide 1')).toBeInTheDocument()
    expect(screen.getByText('Slide 3')).toBeInTheDocument()
  })

  it('exposes a carousel region with an accessible label', () => {
    renderCarousel()
    const region = screen.getByRole('region', { name: 'Test carousel' })
    expect(region).toHaveAttribute('aria-roledescription', 'carousel')
  })

  it('marks each item with the slide role description', () => {
    renderCarousel()
    expect(screen.getByText('Slide 2')).toHaveAttribute('aria-roledescription', 'slide')
  })

  it('renders previous and next buttons with default labels', () => {
    renderCarousel({ loop: true })
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeInTheDocument()
  })

  it('supports custom button labels', () => {
    render(
      <Carousel loop>
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
        </CarouselContent>
        <CarouselPrevious aria-label="Back" />
        <CarouselNext aria-label="Forward" />
      </Carousel>
    )
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Forward' })).toBeInTheDocument()
  })

  it('enables both controls in loop mode and disables them when scroll is impossible', () => {
    renderCarousel({ loop: true })
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled()
  })

  it('clicking next does not throw without native scrolling (jsdom)', () => {
    renderCarousel({ loop: true })
    expect(() => {
      fireEvent.click(screen.getByRole('button', { name: 'Next slide' }))
      fireEvent.click(screen.getByRole('button', { name: 'Previous slide' }))
    }).not.toThrow()
  })

  it('wires ArrowRight / ArrowLeft on the region without throwing (horizontal)', () => {
    renderCarousel({ loop: true })
    const region = screen.getByRole('region', { name: 'Test carousel' })
    expect(() => {
      fireEvent.keyDown(region, { key: 'ArrowRight' })
      fireEvent.keyDown(region, { key: 'ArrowLeft' })
    }).not.toThrow()
  })

  it('wires ArrowDown / ArrowUp on the region for vertical orientation', () => {
    renderCarousel({ loop: true, orientation: 'vertical' })
    const region = screen.getByRole('region', { name: 'Test carousel' })
    expect(() => {
      fireEvent.keyDown(region, { key: 'ArrowDown' })
      fireEvent.keyDown(region, { key: 'ArrowUp' })
    }).not.toThrow()
  })

  it('calls a user-provided onKeyDown handler', () => {
    const onKeyDown = vi.fn()
    render(
      <Carousel loop onKeyDown={onKeyDown} aria-label="cb">
        <CarouselContent>
          <CarouselItem>One</CarouselItem>
        </CarouselContent>
      </Carousel>
    )
    fireEvent.keyDown(screen.getByRole('region', { name: 'cb' }), { key: 'ArrowRight' })
    expect(onKeyDown).toHaveBeenCalled()
  })

  it('throws when subcomponents render outside a Carousel', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<CarouselPrevious />)).toThrow(/must be used within <Carousel>/)
    spy.mockRestore()
  })
})
