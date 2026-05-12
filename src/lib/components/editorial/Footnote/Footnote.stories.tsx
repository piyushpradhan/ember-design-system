import type { Meta, StoryObj } from '@storybook/react-vite'
import { Footnote } from './Footnote'

const meta: Meta<typeof Footnote> = {
  title: 'Editorial/Footnote',
  component: Footnote,
  parameters: { layout: 'padded' },
  decorators: [(S) => <div style={{ maxWidth: 680, fontFamily: 'var(--font-serif)' }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof Footnote>

export const InProse: Story = {
  render: () => (
    <p>
      The brief defines a tight, opinionated system
      <Footnote number={1}>
        "Tight" means most decisions are already made. The escape hatches are deliberate and few.
      </Footnote>
      , and warm neutrals over pure gray
      <Footnote number={2}>
        Slight hue toward <code>#FFB000</code>. Ages better on screens with different white points.
      </Footnote>
      . Both modes are first-class.
    </p>
  ),
}
