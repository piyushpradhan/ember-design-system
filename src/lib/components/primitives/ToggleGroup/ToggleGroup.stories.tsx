import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline,
} from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

const meta = {
  title: 'Primitives/ToggleGroup',
  component: ToggleGroup,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ToggleGroup>

export default meta
type Story = StoryObj<typeof meta>

export const SingleSelection: Story = {
  args: { type: 'single', defaultValue: 'center' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight size={16} aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const MultipleSelection: Story = {
  args: { type: 'multiple', defaultValue: ['bold'], variant: 'outline' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline size={16} aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Vertical: Story = {
  args: { type: 'single', orientation: 'vertical', defaultValue: 'left' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight size={16} aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

export const Disabled: Story = {
  args: { type: 'single', disabled: true, defaultValue: 'center' },
  render: (args) => (
    <ToggleGroup {...args}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <AlignLeft size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <AlignCenter size={16} aria-hidden />
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <AlignRight size={16} aria-hidden />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
}

function ControlledMultiple() {
  const [value, setValue] = useState<string[]>(['bold'])
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
      <ToggleGroup type="multiple" value={value} onValueChange={setValue} variant="outline">
        <ToggleGroupItem value="bold" aria-label="Bold">
          <Bold size={16} aria-hidden />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <Italic size={16} aria-hidden />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <Underline size={16} aria-hidden />
        </ToggleGroupItem>
      </ToggleGroup>
      <span>selected: {value.join(', ') || 'none'}</span>
    </div>
  )
}

export const ControlledExample: Story = {
  args: { type: 'multiple' },
  render: () => <ControlledMultiple />,
}
