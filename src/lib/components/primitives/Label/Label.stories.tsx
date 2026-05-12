import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

const meta = {
  title: 'Primitives/Label',
  component: Label,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'Email address' } }
export const Required: Story = { args: { children: 'Email address', required: true } }
export const Optional: Story = { args: { children: 'Phone number', optional: true } }
export const WithHint: Story = { args: { children: 'Password', hint: 'min. 12 chars' } }
