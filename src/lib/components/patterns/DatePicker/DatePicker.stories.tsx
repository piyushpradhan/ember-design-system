import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'Patterns/DatePicker',
  component: DatePicker,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

function BasicDemo() {
  const [date, setDate] = useState<Date | undefined>()
  return <DatePicker value={date} onChange={setDate} />
}

export const Basic: Story = {
  render: () => <BasicDemo />,
}

function WithDefaultDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return <DatePicker value={date} onChange={setDate} />
}

export const WithDefaultValue: Story = {
  render: () => <WithDefaultDemo />,
}

export const CustomFormat: Story = {
  render: () => {
    function Demo() {
      const [date, setDate] = useState<Date | undefined>(new Date())
      return (
        <DatePicker
          value={date}
          onChange={setDate}
          format={(d) => d.toISOString().slice(0, 10)}
        />
      )
    }
    return <Demo />
  },
}

export const Disabled: Story = {
  args: { disabled: true },
}
