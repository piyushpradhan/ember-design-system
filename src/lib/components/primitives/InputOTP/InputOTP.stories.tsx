import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { InputOTP, InputOTPSeparator } from './InputOTP'

const meta: Meta<typeof InputOTP> = {
  title: 'Primitives/InputOTP',
  component: InputOTP,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof InputOTP>

export const Basic: Story = {
  render: () => <InputOTP length={6} aria-label="Verification code" />,
}

export const Alphanumeric: Story = {
  render: () => <InputOTP length={6} pattern="alphanumeric" aria-label="Coupon code" />,
}

export const WithSeparator: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
      <InputOTP length={6} aria-label="Code with separator" />
      <InputOTPSeparator />
    </div>
  ),
}

export const Disabled: Story = {
  render: () => <InputOTP length={6} defaultValue="123" disabled aria-label="Disabled code" />,
}

function ControlledDemo() {
  const [value, setValue] = useState('')
  const [completed, setCompleted] = useState<string | null>(null)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <InputOTP
        length={4}
        value={value}
        onChange={setValue}
        onComplete={setCompleted}
        aria-label="Controlled code"
      />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Value: {value || '(empty)'}
        {completed ? ` — completed: ${completed}` : ''}
      </span>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
