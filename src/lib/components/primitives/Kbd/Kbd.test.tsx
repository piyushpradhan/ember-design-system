import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Kbd, KbdGroup } from './Kbd'

describe('Kbd', () => {
  it('renders a <kbd> element', () => {
    render(<Kbd>Ctrl</Kbd>)
    const el = screen.getByText('Ctrl')
    expect(el.tagName).toBe('KBD')
  })

  it('renders children', () => {
    render(<Kbd>⌘</Kbd>)
    expect(screen.getByText('⌘')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Kbd className="custom">A</Kbd>)
    expect(screen.getByText('A')).toHaveClass('custom')
  })

  it('renders sm size', () => {
    render(<Kbd size="sm">S</Kbd>)
    expect(screen.getByText('S')).toHaveClass(/size-sm/)
  })

  it('renders md size by default', () => {
    render(<Kbd>M</Kbd>)
    expect(screen.getByText('M')).toHaveClass(/size-md/)
  })

  it('renders icon when provided', () => {
    render(<Kbd icon={<span data-testid="icon" />}>Copy</Kbd>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    let ref: HTMLElement | null = null
    render(
      <Kbd
        ref={(el) => {
          ref = el
        }}
      >
        Ref
      </Kbd>
    )
    expect(ref).not.toBeNull()
    expect(ref?.tagName).toBe('KBD')
  })

  it('passes additional HTML attributes', () => {
    render(<Kbd data-testid="kbd-el" title="Control">Ctrl</Kbd>)
    const el = screen.getByTestId('kbd-el')
    expect(el).toHaveAttribute('title', 'Control')
  })
})

describe('KbdGroup', () => {
  it('renders a <div>', () => {
    const { container } = render(
      <KbdGroup>
        <Kbd>G</Kbd>
      </KbdGroup>
    )
    expect(container.firstElementChild?.tagName).toBe('DIV')
  })

  it('renders multiple Kbd children', () => {
    render(
      <KbdGroup>
        <Kbd>X</Kbd>
        <Kbd>Y</Kbd>
      </KbdGroup>
    )
    expect(screen.getByText('X')).toBeInTheDocument()
    expect(screen.getByText('Y')).toBeInTheDocument()
  })

  it('renders separator between children', () => {
    render(
      <KbdGroup>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <Kbd>F</Kbd>
      </KbdGroup>
    )
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
    expect(screen.getByText('F')).toBeInTheDocument()
    const separators = screen.getAllByText('+')
    expect(separators.length).toBe(2)
  })

  it('custom separator', () => {
    render(
      <KbdGroup separator="then">
        <Kbd>Step1</Kbd>
        <Kbd>Step2</Kbd>
      </KbdGroup>
    )
    expect(screen.getByText('then')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(
      <KbdGroup className="custom-group">
        <Kbd>A</Kbd>
      </KbdGroup>
    )
    expect(container.firstElementChild).toHaveClass('custom-group')
  })

  it('renders single child without separator', () => {
    render(
      <KbdGroup>
        <Kbd>Esc</Kbd>
      </KbdGroup>
    )
    expect(screen.getByText('Esc')).toBeInTheDocument()
    expect(screen.queryByText('+')).not.toBeInTheDocument()
  })
})
