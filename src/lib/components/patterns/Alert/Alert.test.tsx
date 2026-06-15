import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

describe('Alert', () => {
  it('renders children inside a div', () => {
    const { container } = render(<Alert>Hello</Alert>)
    expect(container.firstElementChild?.tagName).toBe('DIV')
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('defaults role to status for non-urgent variants', () => {
    render(<Alert variant="info">Info</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('uses role alert for danger', () => {
    render(<Alert variant="danger">Bad</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('uses role alert for warning', () => {
    render(<Alert variant="warning">Warn</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('allows overriding role', () => {
    render(<Alert variant="danger" role="status">X</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders a default icon per variant', () => {
    const { container } = render(<Alert variant="success">ok</Alert>)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('renders a custom icon when provided', () => {
    render(<Alert icon={<span data-testid="custom-icon" />}>x</Alert>)
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('hides the icon when icon is null', () => {
    const { container } = render(<Alert icon={null}>x</Alert>)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('applies the variant class', () => {
    render(<Alert variant="warning" data-testid="a">x</Alert>)
    expect(screen.getByTestId('a')).toHaveClass(/variant-warning/)
  })

  it('merges custom className', () => {
    render(<Alert className="custom" data-testid="a">x</Alert>)
    expect(screen.getByTestId('a')).toHaveClass('custom')
  })

  it('forwards ref', () => {
    let ref: HTMLDivElement | null = null
    render(<Alert ref={(el) => { ref = el }}>x</Alert>)
    expect(ref).not.toBeNull()
    expect(ref!.tagName).toBe('DIV')
  })

  it('passes through extra attributes', () => {
    render(<Alert data-testid="a" id="my-alert">x</Alert>)
    expect(screen.getByTestId('a')).toHaveAttribute('id', 'my-alert')
  })
})

describe('AlertTitle / AlertDescription', () => {
  it('renders title as a heading', () => {
    render(<AlertTitle>Title</AlertTitle>)
    const el = screen.getByText('Title')
    expect(el.tagName).toBe('H5')
  })

  it('renders description text', () => {
    render(<AlertDescription>Desc</AlertDescription>)
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('title merges className', () => {
    render(<AlertTitle className="t">Title</AlertTitle>)
    expect(screen.getByText('Title')).toHaveClass('t')
  })
})
