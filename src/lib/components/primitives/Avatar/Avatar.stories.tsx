import type { Meta, StoryObj } from '@storybook/react-vite'
import { Avatar, AvatarGroup } from './Avatar'

const meta = {
  title: 'Primitives/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  args: { name: 'Piyush Pradhan' },
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const Initials: Story = {}
export const WithImage: Story = {
  args: { src: 'https://i.pravatar.cc/120?img=12', name: 'Test User' },
}
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Avatar name="Ada Lovelace" size="xs" />
      <Avatar name="Ada Lovelace" size="sm" />
      <Avatar name="Ada Lovelace" size="md" />
      <Avatar name="Ada Lovelace" size="lg" />
      <Avatar name="Ada Lovelace" size="xl" />
    </div>
  ),
}

export const Status: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      <Avatar name="Online" status="online" />
      <Avatar name="Away" status="away" />
      <Avatar name="Busy" status="busy" />
      <Avatar name="Offline" status="offline" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <AvatarGroup max={3}>
      <Avatar name="Ada Lovelace" />
      <Avatar name="Alan Turing" />
      <Avatar name="Grace Hopper" />
      <Avatar name="Edsger Dijkstra" />
    </AvatarGroup>
  ),
}
