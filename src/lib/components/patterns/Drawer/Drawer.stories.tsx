import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Drawer } from './Drawer'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof Drawer> = {
  title: 'Patterns/Drawer',
  component: Drawer,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Drawer>

export const Right: Story = {
  render: () => {
    const [open, setOpen] = useState(false)
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open drawer</Button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Quick settings"
          footer={<Button variant="ghost" onClick={() => setOpen(false)}>Done</Button>}
        >
          <p>Drawer content goes here. Use for secondary forms, filters, or contextual editing.</p>
        </Drawer>
      </>
    )
  },
}
