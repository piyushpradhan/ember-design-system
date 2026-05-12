import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Download, Plus } from 'lucide-react'
import { Button } from './Button'

const meta = {
  title: 'Primitives/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'link'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
  args: { children: 'Continue', variant: 'primary', size: 'md' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {}
export const Secondary: Story = { args: { variant: 'secondary' } }
export const Ghost: Story = { args: { variant: 'ghost' } }
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } }
export const Link: Story = { args: { variant: 'link', children: 'Read more' } }

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}

export const WithIcon: Story = {
  args: { leadingIcon: <Plus size={14} />, children: 'Add item' },
}

export const TrailingIcon: Story = {
  args: { trailingIcon: <ArrowRight size={14} />, children: 'Continue' },
}

export const Loading: Story = { args: { loading: true } }
export const Disabled: Story = { args: { disabled: true } }

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(5, auto)' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
}

export const FullWidth: Story = {
  args: { fullWidth: true, leadingIcon: <Download size={14} />, children: 'Download archive' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
}
