import type { Meta, StoryObj } from '@storybook/react-vite'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './Card'
import { Button } from '../../primitives/Button'
import { Badge } from '../../primitives/Badge'

const meta = {
  title: 'Patterns/Card',
  component: Card,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 400 }}><S /></div>],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Daily Output Tracker</CardTitle>
        <CardDescription>A small Tauri app for tracking shipping cadence.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Currently sitting at 12 day streak, ahead of last month's average.</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost">Dismiss</Button>
        <Button>Open app</Button>
      </CardFooter>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card interactive elevated>
      <CardHeader>
        <CardTitle>
          Recurse log 042
          <Badge tone="accent" size="sm" style={{ marginLeft: 8 }}>new</Badge>
        </CardTitle>
        <CardDescription>On reading 80,000 emails so you don't have to.</CardDescription>
      </CardHeader>
      <CardContent>2026-05-08 · 12 min read</CardContent>
    </Card>
  ),
}
