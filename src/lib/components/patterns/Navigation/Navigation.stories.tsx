import type { Meta, StoryObj } from '@storybook/react-vite'
import { FileText, Inbox, Settings, Users } from 'lucide-react'
import { TopNav, SideNav } from './Navigation'
import { Button } from '../../primitives/Button'

const meta = {
  title: 'Patterns/Navigation',
  parameters: { layout: 'fullscreen' },
} satisfies Meta

export default meta
type Story = StoryObj

export const Top: Story = {
  render: () => (
    <TopNav
      brand="Ember"
      items={[
        { label: 'Overview', active: true },
        { label: 'Recurse' },
        { label: 'Projects' },
        { label: 'About' },
      ]}
      actions={<Button size="sm">Sign in</Button>}
    />
  ),
}

export const Side: Story = {
  render: () => (
    <SideNav
      title="App"
      items={[
        { label: 'Inbox', icon: <Inbox size={16} />, active: true },
        { label: 'Documents', icon: <FileText size={16} /> },
        { label: 'People', icon: <Users size={16} /> },
        { label: 'Settings', icon: <Settings size={16} /> },
      ]}
    />
  ),
}
