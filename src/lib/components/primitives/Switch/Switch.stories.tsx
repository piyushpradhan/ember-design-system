import type { Meta, StoryObj } from '@storybook/react-vite'
import { Switch } from './Switch'

const meta = {
  title: 'Primitives/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: 'Notifications' } }
export const On: Story = { args: { label: 'On by default', defaultChecked: true } }
export const Small: Story = { args: { label: 'Compact', switchSize: 'sm', defaultChecked: true } }
export const WithDescription: Story = {
  args: {
    label: 'Public profile',
    description: 'Anyone with the link can view.',
    defaultChecked: true,
  },
}
