import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './Resizable'

function TwoPanel(props: {
  direction?: 'horizontal' | 'vertical'
  aMin?: number
  aMax?: number
  step?: number
}) {
  const { direction = 'horizontal', aMin = 0, aMax = 100, step } = props
  return (
    <ResizablePanelGroup direction={direction} aria-label="group">
      <ResizablePanel defaultSize={40} minSize={aMin} maxSize={aMax}>
        Panel A
      </ResizablePanel>
      <ResizableHandle keyboardStep={step} />
      <ResizablePanel defaultSize={60}>Panel B</ResizablePanel>
    </ResizablePanelGroup>
  )
}

const basis = (el: HTMLElement) => el.style.flexBasis

describe('Resizable', () => {
  it('renders panels with flex-basis from defaultSize', () => {
    render(<TwoPanel />)
    expect(basis(screen.getByText('Panel A'))).toBe('40%')
    expect(basis(screen.getByText('Panel B'))).toBe('60%')
  })

  it('exposes a separator handle with correct aria for horizontal groups', () => {
    render(<TwoPanel />)
    const handle = screen.getByRole('separator')
    expect(handle).toHaveAttribute('aria-orientation', 'vertical')
    expect(handle).toHaveAttribute('aria-valuenow', '40')
    expect(handle).toHaveAttribute('aria-valuemin', '0')
    expect(handle).toHaveAttribute('aria-valuemax', '100')
    expect(handle).toHaveAttribute('tabindex', '0')
  })

  it('uses horizontal aria-orientation for vertical groups', () => {
    render(<TwoPanel direction="vertical" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('increases the preceding panel with ArrowRight (horizontal)', () => {
    render(<TwoPanel step={5} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(basis(screen.getByText('Panel A'))).toBe('45%')
    expect(basis(screen.getByText('Panel B'))).toBe('55%')
  })

  it('decreases the preceding panel with ArrowLeft (horizontal)', () => {
    render(<TwoPanel step={5} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    expect(basis(screen.getByText('Panel A'))).toBe('35%')
    expect(basis(screen.getByText('Panel B'))).toBe('65%')
  })

  it('uses Arrow Up/Down for vertical groups', () => {
    render(<TwoPanel direction="vertical" step={10} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowDown' })
    expect(basis(screen.getByText('Panel A'))).toBe('50%')
    fireEvent.keyDown(handle, { key: 'ArrowUp' })
    expect(basis(screen.getByText('Panel A'))).toBe('40%')
  })

  it('clamps to the preceding panel minSize', () => {
    render(<TwoPanel aMin={30} step={5} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    fireEvent.keyDown(handle, { key: 'ArrowLeft' })
    // 40 -> would be 25 but clamped to 30
    expect(basis(screen.getByText('Panel A'))).toBe('30%')
    expect(basis(screen.getByText('Panel B'))).toBe('70%')
  })

  it('clamps to the preceding panel maxSize', () => {
    render(<TwoPanel aMax={50} step={20} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(basis(screen.getByText('Panel A'))).toBe('50%')
  })

  it('jumps to min on Home and max on End', () => {
    render(<TwoPanel aMin={20} aMax={80} />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'Home' })
    expect(basis(screen.getByText('Panel A'))).toBe('20%')
    fireEvent.keyDown(handle, { key: 'End' })
    expect(basis(screen.getByText('Panel A'))).toBe('80%')
  })

  it('defaults the keyboard step to 5%', () => {
    render(<TwoPanel />)
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    expect(basis(screen.getByText('Panel A'))).toBe('45%')
  })

  it('keeps the combined size of the resized pair constant', () => {
    render(<TwoPanel step={7} />)
    const a = screen.getByText('Panel A')
    const b = screen.getByText('Panel B')
    const handle = screen.getByRole('separator')
    fireEvent.keyDown(handle, { key: 'ArrowRight' })
    const sum = parseFloat(basis(a)) + parseFloat(basis(b))
    expect(sum).toBeCloseTo(100, 5)
  })

  it('supports pointer capture without throwing (no native rect in jsdom)', () => {
    render(<TwoPanel />)
    const handle = screen.getByRole('separator')
    // jsdom lacks pointer capture; the component guards optional chaining.
    expect(() => {
      fireEvent.pointerDown(handle, { pointerId: 1 })
      fireEvent.pointerUp(handle, { pointerId: 1 })
    }).not.toThrow()
  })

  it('distributes remaining space to panels without an explicit size', () => {
    render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>Sized</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>Auto</ResizablePanel>
      </ResizablePanelGroup>
    )
    expect(basis(screen.getByText('Sized'))).toBe('50%')
    expect(basis(screen.getByText('Auto'))).toBe('50%')
  })

  it('throws when subcomponents render outside a group', () => {
    expect(() => render(<ResizableHandle />)).toThrow(/must be used within <ResizablePanelGroup>/)
  })
})
