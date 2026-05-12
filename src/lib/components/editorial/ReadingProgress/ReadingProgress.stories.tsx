import type { Meta, StoryObj } from '@storybook/react-vite'
import { ReadingProgress } from './ReadingProgress'

const meta = {
  title: 'Editorial/ReadingProgress',
  component: ReadingProgress,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ReadingProgress>

export default meta
type Story = StoryObj<typeof meta>

export const Demo: Story = {
  render: () => (
    <div>
      <ReadingProgress />
      <div style={{ padding: 'var(--space-8)', maxWidth: 680 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <p key={i} style={{ marginBottom: 16 }}>
            Paragraph {i + 1}. Scroll down to see the reading progress bar fill at the top.
          </p>
        ))}
      </div>
    </div>
  ),
}
