import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './AlertDialog'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof AlertDialog> = {
  title: 'Patterns/AlertDialog',
  component: AlertDialog,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button variant="danger">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project and remove all
            associated data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
}

function ControlledDemo() {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', justifyItems: 'start' }}>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open controlled dialog
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out of all devices?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again on every device where you are currently logged in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Stay signed in</AlertDialogCancel>
            <AlertDialogAction>Sign out everywhere</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}
