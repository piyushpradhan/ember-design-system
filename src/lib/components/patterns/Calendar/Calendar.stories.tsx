import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Calendar, type CalendarSelected, type DateRange } from './Calendar'

const meta = {
  title: 'Patterns/Calendar',
  component: Calendar,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Calendar>

export default meta
type Story = StoryObj<typeof meta>

function SingleDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={(v) => setDate(v as Date | undefined)}
    />
  )
}

export const Single: Story = {
  render: () => <SingleDemo />,
}

function RangeDemo() {
  const [range, setRange] = useState<DateRange>({})
  return (
    <Calendar mode="range" selected={range} onSelect={(v) => setRange((v ?? {}) as DateRange)} />
  )
}

export const Range: Story = {
  render: () => <RangeDemo />,
}

function MultipleDemo() {
  const [dates, setDates] = useState<Date[]>([])
  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={(v) => setDates((v ?? []) as Date[])}
    />
  )
}

export const Multiple: Story = {
  render: () => <MultipleDemo />,
}

function DisabledDemo() {
  const [date, setDate] = useState<CalendarSelected>()
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6
  return <Calendar selected={date} onSelect={setDate} disabled={isWeekend} />
}

export const DisabledWeekends: Story = {
  render: () => <DisabledDemo />,
}
