import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tooltip } from './Tooltip'
import { Button } from '../Button'

const meta: Meta<typeof Tooltip> = {
  title: 'Primitives/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Tooltip>

export const Sides: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 64, gridTemplateColumns: 'repeat(4, auto)', padding: 48 }}>
      <Tooltip content="Top tooltip" side="top"><Button variant="secondary">Top</Button></Tooltip>
      <Tooltip content="Right tooltip" side="right"><Button variant="secondary">Right</Button></Tooltip>
      <Tooltip content="Bottom tooltip" side="bottom"><Button variant="secondary">Bottom</Button></Tooltip>
      <Tooltip content="Left tooltip" side="left"><Button variant="secondary">Left</Button></Tooltip>
    </div>
  ),
}
