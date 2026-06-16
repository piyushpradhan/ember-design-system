import { describe, it, expect, vi } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { InputOTP, InputOTPSeparator } from './InputOTP'

function slots(): HTMLInputElement[] {
  return screen.getAllByRole('textbox') as HTMLInputElement[]
}

/** Simulate a user typing a single character into a slot input. */
function typeChar(input: HTMLInputElement, char: string) {
  fireEvent.change(input, { target: { value: char } })
}

describe('InputOTP', () => {
  it('renders the requested number of slots with accessible labels', () => {
    render(<InputOTP length={4} aria-label="My code" />)
    const inputs = slots()
    expect(inputs).toHaveLength(4)
    expect(screen.getByRole('group', { name: 'My code' })).toBeInTheDocument()
    expect(inputs[0]).toHaveAttribute('aria-label', 'Digit 1 of 4')
    expect(inputs[3]).toHaveAttribute('aria-label', 'Digit 4 of 4')
  })

  it('typing fills slots and advances focus', () => {
    render(<InputOTP length={4} />)
    const inputs = slots()
    typeChar(inputs[0], '1')
    expect(inputs[0]).toHaveValue('1')
    expect(inputs[1]).toHaveFocus()
    typeChar(inputs[1], '2')
    expect(inputs[1]).toHaveValue('2')
    expect(inputs[2]).toHaveFocus()
  })

  it('rejects characters that do not match the numeric pattern', () => {
    render(<InputOTP length={4} pattern="numeric" />)
    const inputs = slots()
    typeChar(inputs[0], 'a')
    expect(inputs[0]).toHaveValue('')
  })

  it('accepts letters for the alphanumeric pattern', () => {
    render(<InputOTP length={4} pattern="alphanumeric" />)
    const inputs = slots()
    typeChar(inputs[0], 'A')
    expect(inputs[0]).toHaveValue('A')
  })

  it('Backspace clears the current slot, then retreats and clears the previous', () => {
    render(<InputOTP length={4} defaultValue="12" />)
    const inputs = slots()
    // Focus the slot holding "2".
    fireEvent.focus(inputs[1])
    fireEvent.keyDown(inputs[1], { key: 'Backspace' })
    expect(inputs[1]).toHaveValue('')
    // Now empty: Backspace retreats and clears the previous slot.
    fireEvent.keyDown(inputs[1], { key: 'Backspace' })
    expect(inputs[0]).toHaveValue('')
    expect(inputs[0]).toHaveFocus()
  })

  it('ArrowLeft / ArrowRight move focus between slots', () => {
    render(<InputOTP length={4} defaultValue="1234" />)
    const inputs = slots()
    fireEvent.focus(inputs[2])
    fireEvent.keyDown(inputs[2], { key: 'ArrowLeft' })
    expect(inputs[1]).toHaveFocus()
    fireEvent.keyDown(inputs[1], { key: 'ArrowRight' })
    expect(inputs[2]).toHaveFocus()
  })

  it('paste fills across slots from the focused position', () => {
    render(<InputOTP length={6} />)
    const inputs = slots()
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => '123456' },
    })
    expect(inputs.map((i) => i.value)).toEqual(['1', '2', '3', '4', '5', '6'])
  })

  it('paste ignores characters beyond the available slots', () => {
    render(<InputOTP length={4} />)
    const inputs = slots()
    fireEvent.paste(inputs[0], {
      clipboardData: { getData: () => '1234567' },
    })
    expect(inputs.map((i) => i.value)).toEqual(['1', '2', '3', '4'])
  })

  it('fires onComplete once when every slot is filled', () => {
    const onComplete = vi.fn()
    render(<InputOTP length={3} onComplete={onComplete} />)
    const inputs = slots()
    typeChar(inputs[0], '1')
    typeChar(inputs[1], '2')
    expect(onComplete).not.toHaveBeenCalled()
    typeChar(inputs[2], '3')
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onComplete).toHaveBeenCalledWith('123')
  })

  it('calls onChange reflecting the full value', () => {
    const onChange = vi.fn()
    render(<InputOTP length={4} onChange={onChange} />)
    const inputs = slots()
    typeChar(inputs[0], '7')
    expect(onChange).toHaveBeenLastCalledWith('7')
    typeChar(inputs[1], '8')
    expect(onChange).toHaveBeenLastCalledWith('78')
  })

  it('supports controlled value', () => {
    function Controlled() {
      const [v, setV] = useState('')
      return <InputOTP length={4} value={v} onChange={setV} />
    }
    render(<Controlled />)
    const inputs = slots()
    typeChar(inputs[0], '5')
    expect(inputs[0]).toHaveValue('5')
    typeChar(inputs[1], '6')
    expect(inputs[1]).toHaveValue('6')
  })

  it('does not accept input when disabled', () => {
    render(<InputOTP length={4} disabled />)
    const inputs = slots()
    expect(inputs[0]).toBeDisabled()
    typeChar(inputs[0], '1')
    expect(inputs[0]).toHaveValue('')
  })

  it('renders a separator with separator role and hidden from a11y tree', () => {
    render(<InputOTPSeparator />)
    const sep = screen.getByText('-')
    expect(sep).toHaveAttribute('aria-hidden', 'true')
  })
})
