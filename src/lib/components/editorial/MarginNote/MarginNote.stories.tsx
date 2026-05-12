import type { Meta, StoryObj } from '@storybook/react-vite'
import { MarginNote } from './MarginNote'

const meta: Meta<typeof MarginNote> = {
  title: 'Editorial/MarginNote',
  component: MarginNote,
  parameters: { layout: 'padded' },
  decorators: [(S) => <div style={{ maxWidth: 880 }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof MarginNote>

export const Inline: Story = {
  render: () => (
    <p className="prose" style={{ fontFamily: 'var(--font-serif)' }}>
      Editorial surfaces should read like editorial — long lines of serif type, with side
      notes for tangents.
      <MarginNote label="Why a serif?" side="right">
        Reading 2,000 words in sans is hostile. Serifs guide the eye between lines.
      </MarginNote>
      The system shares tokens with product surfaces, not layouts.
    </p>
  ),
}
