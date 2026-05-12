import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Modal } from './Modal'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof Modal> = {
  title: 'Patterns/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Modal>

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open modal</Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete migration plan?"
          description="This action will permanently remove the schema migration draft."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => setOpen(false)}>Delete plan</Button>
            </>
          }
        >
          <p>
            You're about to delete the draft migration <code>0042_user_schema.sql</code>. The associated review thread will be archived.
          </p>
        </Modal>
      </>
    )
  },
}
