import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './DropdownMenu'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof DropdownMenu> = {
  title: 'Patterns/DropdownMenu',
  component: DropdownMenu,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof DropdownMenu>

export const Basic: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Open menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuItem>
          Profile <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          Settings <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Billing (disabled)</DropdownMenuItem>
        <DropdownMenuItem variant="danger">Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}

function CheckboxDemo() {
  const [bookmarks, setBookmarks] = useState(true)
  const [urls, setUrls] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>View options</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
          Show bookmarks
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem checked={urls} onCheckedChange={setUrls}>
          Show full URLs
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Checkboxes: Story = { render: () => <CheckboxDemo /> }

function RadioDemo() {
  const [position, setPosition] = useState('bottom')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Panel position</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Position</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RadioGroup: Story = { render: () => <RadioDemo /> }

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuItem>New file</DropdownMenuItem>
          <DropdownMenuItem>New window</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>Email link</DropdownMenuItem>
            <DropdownMenuItem>Copy link</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>More options…</DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
}
