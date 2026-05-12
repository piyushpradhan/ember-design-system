import type { Meta, StoryObj } from '@storybook/react-vite'
import { ToastProvider, useToast } from './Toast'
import { Button } from '../../primitives/Button'

const Demo = () => {
  const { toast } = useToast()
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Saved', description: 'Draft saved 5s ago.', tone: 'success' })}>
        Success
      </Button>
      <Button variant="secondary" onClick={() => toast({ title: 'Heads up', description: 'Token expiry in 5 min.', tone: 'warning' })}>
        Warning
      </Button>
      <Button variant="danger" onClick={() => toast({ title: 'Failed', description: 'Build broke on lint.', tone: 'danger' })}>
        Danger
      </Button>
      <Button variant="ghost" onClick={() => toast({ title: 'FYI', description: 'New release available.', tone: 'info' })}>
        Info
      </Button>
    </div>
  )
}

const meta = {
  title: 'Patterns/Toast',
  parameters: { layout: 'centered' },
  decorators: [
    (S) => (
      <ToastProvider>
        <S />
      </ToastProvider>
    ),
  ],
} satisfies Meta

export default meta
type Story = StoryObj

export const Triggers: Story = { render: () => <Demo /> }
