import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Calendar, Settings, User, CreditCard, Smile, Search } from 'lucide-react'
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
  CommandDialog,
} from './Command'
import { Button } from '../../primitives/Button'

const meta = {
  title: 'Patterns/Command',
  component: Command,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div style={{ width: 420 }}>
      <Command>
        <CommandInput placeholder="Type a command or search…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem value="Calendar" onSelect={() => {}}>
              <Calendar size={16} />
              Calendar
            </CommandItem>
            <CommandItem value="Search Emoji" onSelect={() => {}}>
              <Smile size={16} />
              Search Emoji
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem value="Profile" onSelect={() => {}}>
              <User size={16} />
              Profile
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem value="Billing" onSelect={() => {}}>
              <CreditCard size={16} />
              Billing
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem value="Settings" disabled>
              <Settings size={16} />
              Settings (disabled)
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  ),
}

function DialogDemo() {
  const [open, setOpen] = useState(false)
  const [picked, setPicked] = useState<string | null>(null)
  const select = (value: string) => {
    setPicked(value)
    setOpen(false)
  }
  return (
    <div style={{ display: 'grid', gap: 'var(--space-3)', placeItems: 'center' }}>
      <Button variant="secondary" leadingIcon={<Search size={16} />} onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      {picked && <span style={{ fontSize: 'var(--text-sm)' }}>Picked: {picked}</span>}
      <CommandDialog open={open} onClose={() => setOpen(false)} title="Command Palette">
        <CommandInput placeholder="Search actions…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem value="New File" onSelect={select}>
              New File
            </CommandItem>
            <CommandItem value="New Window" onSelect={select}>
              New Window
            </CommandItem>
            <CommandItem value="Open Settings" onSelect={select}>
              Open Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export const Dialog: Story = {
  render: () => <DialogDemo />,
}
