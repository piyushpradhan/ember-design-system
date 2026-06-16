import type { Meta, StoryObj } from '@storybook/react-vite'
import { ScrollArea } from './ScrollArea'

const meta = {
  title: 'Primitives/ScrollArea',
  component: ScrollArea,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof ScrollArea>

export default meta
type Story = StoryObj<typeof meta>

const itemStyle = {
  padding: 'var(--space-2) var(--space-3)',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-secondary)',
  borderBottom: '1px solid var(--border-subtle)',
} as const

const tags = Array.from({ length: 30 }, (_, i) => `v1.${i}.0`)

export const Vertical: Story = {
  render: () => (
    <ScrollArea
      maxHeight={200}
      style={{
        width: 240,
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
      }}
    >
      {tags.map((t) => (
        <div key={t} style={itemStyle}>
          Release {t}
        </div>
      ))}
    </ScrollArea>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <ScrollArea
      orientation="horizontal"
      style={{
        width: 320,
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{ display: 'flex', gap: 'var(--space-3)', padding: 'var(--space-3)' }}>
        {tags.map((t) => (
          <div
            key={t}
            style={{
              flex: '0 0 auto',
              padding: 'var(--space-2) var(--space-4)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-sm)',
            }}
          >
            {t}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}

export const Both: Story = {
  render: () => (
    <ScrollArea
      orientation="both"
      maxHeight={200}
      style={{
        width: 320,
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)',
        background: 'var(--bg-surface)',
      }}
    >
      <div style={{ width: 640 }}>
        {tags.map((t) => (
          <div key={t} style={itemStyle}>
            A fairly long release note line for {t} that overflows horizontally.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
}
