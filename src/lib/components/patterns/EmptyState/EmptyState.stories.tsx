import type { Meta, StoryObj } from '@storybook/react-vite'
import { Inbox } from 'lucide-react'
import { EmptyState } from './EmptyState'
import { Button } from '../../primitives/Button'

const meta = {
  title: 'Patterns/EmptyState',
  component: EmptyState,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 520 }}><S /></div>],
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    icon: <Inbox size={24} />,
    title: 'No items yet',
    description: 'You haven\'t shipped anything today. Pick one thing and ship it.',
    actions: <Button>Create entry</Button>,
  },
}
