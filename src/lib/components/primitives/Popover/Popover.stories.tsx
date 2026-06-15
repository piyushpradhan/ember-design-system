import type { Meta, StoryObj } from '@storybook/react-vite'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from './Popover'
import { Button } from '../Button'

const meta = {
  title: 'Primitives/Popover',
  component: Popover,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>
        <Button variant="secondary">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent placement="bottom" style={{ maxWidth: 260 }}>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong style={{ fontSize: 'var(--text-sm)' }}>Dimensions</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
            Set the dimensions for the layer. Click outside or press Escape to dismiss.
          </p>
          <PopoverClose
            style={{
              marginTop: 'var(--space-2)',
              alignSelf: 'flex-start',
              fontSize: 'var(--text-xs)',
              color: 'var(--accent-ember-500)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Close
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
}

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger>
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          </PopoverTrigger>
          <PopoverContent placement={side}>Placed on {side}</PopoverContent>
        </Popover>
      ))}
    </div>
  ),
}
