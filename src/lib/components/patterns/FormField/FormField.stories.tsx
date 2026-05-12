import type { Meta, StoryObj } from '@storybook/react-vite'
import { FormField } from './FormField'
import { Input } from '../../primitives/Input'

const meta = {
  title: 'Patterns/FormField',
  component: FormField,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 360 }}><S /></div>],
} satisfies Meta<typeof FormField>

export default meta
type Story = StoryObj<typeof meta>

export const WithHint: Story = {
  args: {
    label: 'Email address',
    required: true,
    hint: 'We will only use this to confirm your account.',
    children: <Input type="email" placeholder="you@example.com" />,
  },
}

export const WithError: Story = {
  args: {
    label: 'Password',
    required: true,
    error: 'Password must be at least 12 characters.',
    children: <Input type="password" defaultValue="short" />,
  },
}
