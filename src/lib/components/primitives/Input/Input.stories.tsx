import type { Meta, StoryObj } from '@storybook/react-vite'
import { Search, Mail } from 'lucide-react'
import { Input } from './Input'

const meta = {
  title: 'Primitives/Input',
  component: Input,
  parameters: { layout: 'centered' },
  args: { placeholder: 'Type something…' },
  decorators: [(S) => <div style={{ width: 320 }}><S /></div>],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithLeadingIcon: Story = {
  args: { leadingIcon: <Search size={14} />, placeholder: 'Search…' },
}
export const WithTrailingIcon: Story = {
  args: { trailingIcon: <Mail size={14} />, placeholder: 'you@example.com' },
}
export const Invalid: Story = { args: { invalid: true, defaultValue: 'invalid value' } }
export const Disabled: Story = { args: { disabled: true, defaultValue: 'Cannot edit' } }
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 8 }}>
      <Input inputSize="sm" placeholder="Small" />
      <Input inputSize="md" placeholder="Medium" />
      <Input inputSize="lg" placeholder="Large" />
    </div>
  ),
}
