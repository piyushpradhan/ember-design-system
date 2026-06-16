import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Slider } from './Slider'

const meta = {
  title: 'Primitives/Slider',
  component: Slider,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Slider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { defaultValue: 40, 'aria-label': 'Volume' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Slider {...args} />
    </div>
  ),
}

export const Range: Story = {
  args: { defaultValue: [20, 70], 'aria-label': 'Price range' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Slider {...args} />
    </div>
  ),
}

export const Stepped: Story = {
  args: { defaultValue: 50, step: 10, 'aria-label': 'Stepped' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Slider {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: { defaultValue: 40, disabled: true, 'aria-label': 'Disabled' },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Slider {...args} />
    </div>
  ),
}

export const Vertical: Story = {
  args: { defaultValue: 40, orientation: 'vertical', 'aria-label': 'Vertical' },
  render: (args) => (
    <div style={{ height: 180 }}>
      <Slider {...args} />
    </div>
  ),
}

function Controlled() {
  const [value, setValue] = useState<number>(30)
  return (
    <div style={{ width: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Slider
        value={value}
        onValueChange={(v) => setValue(v as number)}
        aria-label="Controlled"
      />
      <span>value: {value}</span>
    </div>
  )
}

export const ControlledExample: Story = {
  render: () => <Controlled />,
}
