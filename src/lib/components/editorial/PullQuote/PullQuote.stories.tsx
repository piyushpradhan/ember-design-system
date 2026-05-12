import type { Meta, StoryObj } from '@storybook/react-vite'
import { PullQuote } from './PullQuote'

const meta = {
  title: 'Editorial/PullQuote',
  component: PullQuote,
  parameters: { layout: 'padded' },
  decorators: [(S) => <div style={{ maxWidth: 680 }}><S /></div>],
} satisfies Meta<typeof PullQuote>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Craft is visible in restraint. A well-set paragraph beats a clever animation.',
    attribution: 'Design Brief, Section 2',
  },
}
