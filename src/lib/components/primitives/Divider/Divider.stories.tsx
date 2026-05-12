import type { Meta, StoryObj } from '@storybook/react-vite'
import { Divider } from './Divider'

const meta = {
  title: 'Primitives/Divider',
  component: Divider,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 400 }}><S /></div>],
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Horizontal: Story = {}
export const Dashed: Story = { args: { variant: 'dashed' } }
export const WithLabel: Story = { args: { label: 'or continue with' } }
export const Vertical: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 24 }}>
      <span>Left</span>
      <Divider orientation="vertical" />
      <span>Middle</span>
      <Divider orientation="vertical" />
      <span>Right</span>
    </div>
  ),
}
