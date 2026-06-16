import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Combobox, type ComboboxOption } from './Combobox'

const meta = {
  title: 'Patterns/Combobox',
  component: Combobox,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const frameworks: ComboboxOption[] = [
  { label: 'Next.js', value: 'next' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
  { label: 'Solid Start', value: 'solid' },
]

export const Default: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select framework…',
    searchPlaceholder: 'Search framework…',
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
}

function ControlledDemo() {
  const [value, setValue] = useState<string>('remix')
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', width: 280 }}>
      <Combobox
        options={frameworks}
        value={value}
        onChange={setValue}
        placeholder="Select framework…"
      />
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
        Selected: {value || '(none)'}
      </span>
    </div>
  )
}

export const Controlled: Story = {
  args: { options: frameworks },
  render: () => <ControlledDemo />,
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { label: 'Free', value: 'free' },
      { label: 'Pro', value: 'pro' },
      { label: 'Enterprise (contact sales)', value: 'enterprise', disabled: true },
    ],
    placeholder: 'Choose a plan…',
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    options: frameworks,
    placeholder: 'Select framework…',
    disabled: true,
  },
  render: (args) => (
    <div style={{ width: 280 }}>
      <Combobox {...args} />
    </div>
  ),
}
