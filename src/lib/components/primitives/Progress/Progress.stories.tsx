import { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { Progress } from './Progress'

const meta = {
  title: 'Primitives/Progress',
  component: Progress,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress value={60} aria-label="Upload progress" />
    </div>
  ),
}

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      <Progress value={40} size="sm" aria-label="Small" />
      <Progress value={40} size="md" aria-label="Medium" />
    </div>
  ),
}

export const Indeterminate: Story = {
  render: () => (
    <div style={{ width: 320 }}>
      <Progress indeterminate aria-label="Loading" />
    </div>
  ),
}

function AnimatedDemo() {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => (v >= 100 ? 0 : v + 10))
    }, 600)
    return () => clearInterval(id)
  }, [])
  return (
    <div style={{ width: 320 }}>
      <Progress value={value} aria-label="Animated progress" />
    </div>
  )
}

export const Animated: Story = {
  render: () => <AnimatedDemo />,
}
