import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tag } from './Tag'

const meta = {
  title: 'Primitives/Tag',
  component: Tag,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Tag>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { children: 'typography' } }
export const Removable: Story = { args: { children: 'design-system', removable: true } }
export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
      <Tag interactive>typography</Tag>
      <Tag interactive>tokens</Tag>
      <Tag removable>draft</Tag>
      <Tag>v0.1</Tag>
    </div>
  ),
}
