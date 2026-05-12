import type { Meta, StoryObj } from '@storybook/react-vite'
import { Heart, Settings, X } from 'lucide-react'
import { IconButton } from './IconButton'

const meta = {
  title: 'Primitives/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  args: { 'aria-label': 'Settings', icon: <Settings size={16} /> },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <IconButton aria-label="Settings" icon={<Settings size={16} />} variant="primary" />
      <IconButton aria-label="Settings" icon={<Settings size={16} />} variant="secondary" />
      <IconButton aria-label="Settings" icon={<Settings size={16} />} variant="ghost" />
      <IconButton aria-label="Close" icon={<X size={16} />} variant="danger" />
      <IconButton aria-label="Favorite" icon={<Heart size={16} />} />
    </div>
  ),
}
