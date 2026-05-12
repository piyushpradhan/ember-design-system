import type { Meta, StoryObj } from '@storybook/react-vite'
import { Select } from './Select'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 280 }}><S /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: (
      <>
        <option value="">Pick one…</option>
        <option value="apple">Apple</option>
        <option value="berry">Berry</option>
        <option value="cherry">Cherry</option>
      </>
    ),
  },
}
