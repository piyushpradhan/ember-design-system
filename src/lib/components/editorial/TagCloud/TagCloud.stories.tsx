import type { Meta, StoryObj } from '@storybook/react-vite'
import { TagCloud } from './TagCloud'

const meta = {
  title: 'Editorial/TagCloud',
  component: TagCloud,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof TagCloud>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: 'design-system', count: 12 },
      { label: 'typography', count: 8 },
      { label: 'tauri', count: 5 },
      { label: 'writing', count: 4 },
      { label: 'tokens', count: 3 },
      { label: 'workflow', count: 2 },
    ],
  },
}
