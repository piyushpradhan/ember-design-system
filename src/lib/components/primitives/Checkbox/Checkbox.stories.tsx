import type { Meta, StoryObj } from '@storybook/react-vite'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'Primitives/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: 'Accept terms' } }
export const Checked: Story = { args: { label: 'Subscribed', defaultChecked: true } }
export const Indeterminate: Story = { args: { label: 'Some selected', indeterminate: true, defaultChecked: true } }
export const Disabled: Story = { args: { label: 'Cannot toggle', disabled: true } }
export const WithDescription: Story = {
  args: {
    label: 'Receive product updates',
    description: 'No more than one email a week. Unsubscribe anytime.',
  },
}
