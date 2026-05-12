import type { Meta, StoryObj } from '@storybook/react-vite'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Patterns/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: 'Recurse', href: '/recurse' },
      { label: '2026', href: '/recurse/2026' },
      { label: 'On reading 80,000 emails so you don\'t have to' },
    ],
  },
}
