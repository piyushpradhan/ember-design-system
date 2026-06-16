import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Bold, Italic, Underline } from 'lucide-react'
import { Toggle } from './Toggle'

const meta = {
  title: 'Primitives/Toggle',
  component: Toggle,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Toggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Toggle' },
}

export const WithIcon: Story = {
  args: { children: <Bold size={16} aria-hidden />, 'aria-label': 'Bold' },
}

export const Outline: Story = {
  args: { variant: 'outline', children: <Italic size={16} aria-hidden />, 'aria-label': 'Italic' },
}

export const PressedByDefault: Story = {
  args: { defaultPressed: true, children: <Underline size={16} aria-hidden />, 'aria-label': 'Underline' },
}

export const Disabled: Story = {
  args: { disabled: true, children: 'Disabled' },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  ),
}

function Controlled() {
  const [pressed, setPressed] = useState(false)
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Toggle pressed={pressed} onPressedChange={setPressed}>
        {pressed ? 'On' : 'Off'}
      </Toggle>
      <span>state: {String(pressed)}</span>
    </div>
  )
}

export const ControlledExample: Story = {
  render: () => <Controlled />,
}
