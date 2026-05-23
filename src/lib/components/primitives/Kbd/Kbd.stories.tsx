import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from './Kbd'

const meta = {
  title: 'Primitives/Kbd',
  component: Kbd,
  parameters: { layout: 'centered' },
  args: { children: 'Ctrl' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Kbd size="sm">S</Kbd>
      <Kbd size="md">S</Kbd>
    </div>
  ),
}

export const Keys: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd>⌘</Kbd>
      <Kbd>⌥</Kbd>
      <Kbd>⌃</Kbd>
      <Kbd>⇧</Kbd>
      <Kbd>↵</Kbd>
      <Kbd>⌫</Kbd>
      <Kbd>⎋</Kbd>
      <Kbd>⇥</Kbd>
    </div>
  ),
}

export const Letters: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd>A</Kbd>
      <Kbd>B</Kbd>
      <Kbd>C</Kbd>
      <Kbd>D</Kbd>
      <Kbd>Space</Kbd>
      <Kbd>Enter</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd>Tab</Kbd>
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: 'var(--font-sans)' }}>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Use <KbdGroup><Kbd>Ctrl</Kbd><Kbd>B</Kbd></KbdGroup> to toggle bold
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Press <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup> to open the command palette
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Save with <KbdGroup><Kbd>⌘</Kbd><Kbd>Shift</Kbd><Kbd>S</Kbd></KbdGroup>
      </span>
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <p style={{ maxWidth: 400, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
      To open the search dialog, press <Kbd>⌘</Kbd>+<Kbd>F</Kbd> on your keyboard. 
      Navigate between results with <Kbd>↵</Kbd> and close the dialog with <Kbd>⎋</Kbd>.
    </p>
  ),
}
