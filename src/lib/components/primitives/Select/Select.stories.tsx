import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Apple, Cherry, Grape } from 'lucide-react'
import { Select } from './Select'

const meta = {
  title: 'Primitives/Select',
  component: Select,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 280 }}><S /></div>],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'berry', label: 'Berry' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date', disabled: true },
  { value: 'elderberry', label: 'Elderberry' },
]

export const Default: Story = {
  args: {
    options: fruits,
    placeholder: 'Pick a fruit…',
  },
}

export const WithIconsAndDescriptions: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple', description: 'Crisp and sweet', icon: <Apple size={14} /> },
      { value: 'cherry', label: 'Cherry', description: 'Tart and bold', icon: <Cherry size={14} /> },
      { value: 'grape', label: 'Grape', description: 'Juicy clusters', icon: <Grape size={14} /> },
    ],
    placeholder: 'Choose a fruit',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | undefined>('berry')
    return <Select {...args} value={value} onChange={setValue} />
  },
  args: { options: fruits, placeholder: 'Pick…' },
}

export const Invalid: Story = {
  args: { options: fruits, invalid: true, placeholder: 'Required' },
}

export const Disabled: Story = {
  args: { options: fruits, disabled: true, defaultValue: 'apple' },
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Select options={fruits} selectSize="sm" placeholder="Small" />
      <Select options={fruits} selectSize="md" placeholder="Medium" />
      <Select options={fruits} selectSize="lg" placeholder="Large" />
    </div>
  ),
  args: { options: fruits },
}
