import type { Meta, StoryObj } from '@storybook/react-vite'
import { HoverCard, HoverCardTrigger, HoverCardContent } from './HoverCard'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof HoverCard> = {
  title: 'Patterns/HoverCard',
  component: HoverCard,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof HoverCard>

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger>
        <Button variant="link">@ember</Button>
      </HoverCardTrigger>
      <HoverCardContent>
        <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
          <strong style={{ fontSize: 'var(--text-base)' }}>Ember Design System</strong>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: 'var(--text-sm)' }}>
            A warm, accessible component library built on React 19 and CSS Modules.
          </p>
          <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)' }}>
            Joined June 2026
          </span>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
}

export const Placements: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--space-6)' }}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <HoverCard key={side}>
          <HoverCardTrigger>
            <Button variant="secondary" size="sm">
              {side}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent placement={side}>Hovering shows on {side}</HoverCardContent>
        </HoverCard>
      ))}
    </div>
  ),
}
