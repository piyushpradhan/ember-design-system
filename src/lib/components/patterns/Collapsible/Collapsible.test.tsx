import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { useState } from 'react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'

function Example(props: { defaultOpen?: boolean; disabled?: boolean }) {
  return (
    <Collapsible defaultOpen={props.defaultOpen} disabled={props.disabled}>
      <CollapsibleTrigger>
        <button>Toggle</button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <p>Panel body</p>
      </CollapsibleContent>
    </Collapsible>
  )
}

describe('Collapsible', () => {
  it('is closed by default and hides content', () => {
    render(<Example />)
    expect(screen.getByText('Panel body')).not.toBeVisible()
    expect(screen.getByRole('region', { hidden: true })).toHaveAttribute('hidden')
  })

  it('honours defaultOpen', () => {
    render(<Example defaultOpen />)
    expect(screen.getByText('Panel body')).toBeVisible()
  })

  it('toggles open/closed on trigger click', () => {
    render(<Example />)
    const trigger = screen.getByText('Toggle')
    fireEvent.click(trigger)
    expect(screen.getByText('Panel body')).toBeVisible()
    fireEvent.click(trigger)
    expect(screen.getByText('Panel body')).not.toBeVisible()
  })

  it('sets aria-expanded and aria-controls on the trigger', () => {
    render(<Example />)
    const trigger = screen.getByText('Toggle')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    const region = screen.getByRole('region', { hidden: true })
    expect(trigger).toHaveAttribute('aria-controls', region.id)
    fireEvent.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('links content back to the trigger via aria-labelledby', () => {
    render(<Example defaultOpen />)
    const trigger = screen.getByText('Toggle')
    const region = screen.getByRole('region')
    expect(region).toHaveAttribute('aria-labelledby', trigger.id)
  })

  it('does not toggle and disables the trigger when disabled', () => {
    render(<Example disabled />)
    const trigger = screen.getByText('Toggle') as HTMLButtonElement
    expect(trigger).toBeDisabled()
    fireEvent.click(trigger)
    expect(screen.getByText('Panel body')).not.toBeVisible()
  })

  it('reflects data-state on root, trigger and content', () => {
    render(<Example defaultOpen />)
    const trigger = screen.getByText('Toggle')
    expect(trigger).toHaveAttribute('data-state', 'open')
    expect(screen.getByRole('region')).toHaveAttribute('data-state', 'open')
  })

  it('supports controlled usage via open/onOpenChange', () => {
    const onOpenChange = vi.fn()
    function Controlled() {
      const [open, setOpen] = useState(false)
      return (
        <Collapsible
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next)
            setOpen(next)
          }}
        >
          <CollapsibleTrigger>
            <button>Toggle</button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <p>Panel body</p>
          </CollapsibleContent>
        </Collapsible>
      )
    }
    render(<Controlled />)
    fireEvent.click(screen.getByText('Toggle'))
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(screen.getByText('Panel body')).toBeVisible()
  })

  it('preserves a consumer onClick on the trigger child', () => {
    const onClick = vi.fn()
    render(
      <Collapsible>
        <CollapsibleTrigger>
          <button onClick={onClick}>Toggle</button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>Panel body</p>
        </CollapsibleContent>
      </Collapsible>
    )
    fireEvent.click(screen.getByText('Toggle'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('throws when subcomponents are used outside a Collapsible', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() =>
      render(
        <CollapsibleContent>
          <p>x</p>
        </CollapsibleContent>
      )
    ).toThrow(/must be used within <Collapsible>/)
    spy.mockRestore()
  })
})
