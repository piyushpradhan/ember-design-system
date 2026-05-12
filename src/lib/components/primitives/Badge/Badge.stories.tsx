import type { Meta, StoryObj } from '@storybook/react-vite'
import { CheckCircle2 } from 'lucide-react'
import { Badge } from './Badge'

const meta = {
  title: 'Primitives/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  args: { children: 'Beta' },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Subtle: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="success" icon={<CheckCircle2 size={12} />}>Shipped</Badge>
      <Badge tone="warning">Warning</Badge>
      <Badge tone="danger">Danger</Badge>
      <Badge tone="info">Info</Badge>
    </div>
  ),
}

export const Solid: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="neutral" variant="solid">Neutral</Badge>
      <Badge tone="accent" variant="solid">Accent</Badge>
      <Badge tone="success" variant="solid">Live</Badge>
      <Badge tone="danger" variant="solid">Broken</Badge>
    </div>
  ),
}

export const Outline: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge tone="neutral" variant="outline">v0.1</Badge>
      <Badge tone="accent" variant="outline">New</Badge>
      <Badge tone="info" variant="outline">Draft</Badge>
    </div>
  ),
}
