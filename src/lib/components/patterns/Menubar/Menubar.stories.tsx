import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarLabel,
  MenubarSeparator,
  MenubarShortcut,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from './Menubar'

const meta: Meta<typeof Menubar> = {
  title: 'Patterns/Menubar',
  component: Menubar,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Menubar>

export const Basic: Story = {
  render: () => (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            New window <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>Print…</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            Undo <MenubarShortcut>⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Cut</MenubarItem>
          <MenubarItem>Copy</MenubarItem>
          <MenubarItem>Paste</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reload</MenubarItem>
          <MenubarItem>Toggle fullscreen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  ),
}

function StatefulDemo() {
  const [bookmarks, setBookmarks] = useState(true)
  const [profile, setProfile] = useState('andy')
  return (
    <Menubar>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel>Appearance</MenubarLabel>
          <MenubarCheckboxItem checked={bookmarks} onCheckedChange={setBookmarks}>
            Always show bookmarks
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu value="profiles">
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Switch profile</MenubarLabel>
            <MenubarRadioGroup value={profile} onValueChange={setProfile}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

export const WithStateAndSubmenu: Story = { render: () => <StatefulDemo /> }
