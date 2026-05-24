import type { Meta, StoryObj } from '@storybook/react-vite'
import { Kbd, KbdGroup } from './Kbd'
import {
  KbdCmd,
  KbdCtrl,
  KbdOption,
  KbdShift,
  KbdTab,
  KbdReturn,
  KbdBackspace,
  KbdEscape,
  KbdArrowUp,
  KbdArrowDown,
  KbdArrowLeft,
  KbdArrowRight,
} from './key-icons'

const meta = {
  title: 'Primitives/Kbd',
  component: Kbd,
  parameters: { layout: 'centered' },
  args: { children: 'Ctrl' },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { icon: <KbdCtrl />, children: 'K' },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Kbd size="sm" icon={<KbdCmd />}>S</Kbd>
      <Kbd size="md" icon={<KbdCmd />}>S</Kbd>
    </div>
  ),
}

export const ModifierKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd icon={<KbdCmd />}>Cmd</Kbd>
      <Kbd icon={<KbdOption />}>Option</Kbd>
      <Kbd icon={<KbdCtrl />}>Ctrl</Kbd>
      <Kbd icon={<KbdShift />}>Shift</Kbd>
    </div>
  ),
}

export const NavigationKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd icon={<KbdTab />}>Tab</Kbd>
      <Kbd icon={<KbdReturn />}>Enter</Kbd>
      <Kbd icon={<KbdBackspace />}>Backspace</Kbd>
      <Kbd icon={<KbdEscape />}>Esc</Kbd>
    </div>
  ),
}

export const ArrowKeys: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
      <Kbd icon={<KbdArrowUp />}>Up</Kbd>
      <Kbd icon={<KbdArrowDown />}>Down</Kbd>
      <Kbd icon={<KbdArrowLeft />}>Left</Kbd>
      <Kbd icon={<KbdArrowRight />}>Right</Kbd>
    </div>
  ),
}

export const TextOnly: Story = {
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
        Use <KbdGroup><Kbd icon={<KbdCtrl />}>B</Kbd></KbdGroup> to toggle bold
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Press <KbdGroup><Kbd icon={<KbdCmd />}>K</Kbd></KbdGroup> to open the command palette
      </span>
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Save with <KbdGroup><Kbd icon={<KbdCmd />} /><Kbd icon={<KbdShift />} /><Kbd>S</Kbd></KbdGroup>
      </span>
    </div>
  ),
}

export const Inline: Story = {
  render: () => (
    <p style={{ maxWidth: 400, lineHeight: 1.6, color: 'var(--text-secondary)' }}>
      To open the search dialog, press <Kbd icon={<KbdCmd />}>F</Kbd> on your keyboard.
      Navigate between results with <Kbd icon={<KbdReturn />}>Enter</Kbd> and close the dialog with <Kbd icon={<KbdEscape />}>Esc</Kbd>.
    </p>
  ),
}
