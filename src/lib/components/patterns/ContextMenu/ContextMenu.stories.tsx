import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './ContextMenu'
import styles from './ContextMenu.module.css'

const meta: Meta<typeof ContextMenu> = {
  title: 'Patterns/ContextMenu',
  component: ContextMenu,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof ContextMenu>

export const Basic: Story = {
  render: () => (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={styles.trigger}>Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Edit</ContextMenuLabel>
        <ContextMenuItem>
          Back <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem>
          Forward <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem disabled>Reload (disabled)</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem variant="danger">Delete</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
}

function StatefulDemo() {
  const [showGrid, setShowGrid] = useState(true)
  const [zoom, setZoom] = useState('100')
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className={styles.trigger}>Right-click for view options</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>View</ContextMenuLabel>
          <ContextMenuCheckboxItem checked={showGrid} onCheckedChange={setShowGrid}>
            Show grid
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuLabel>Zoom</ContextMenuLabel>
        <ContextMenuRadioGroup value={zoom} onValueChange={setZoom}>
          <ContextMenuRadioItem value="50">50%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="100">100%</ContextMenuRadioItem>
          <ContextMenuRadioItem value="200">200%</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save page as…</ContextMenuItem>
            <ContextMenuItem>Create shortcut…</ContextMenuItem>
            <ContextMenuItem>Inspect</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuContent>
    </ContextMenu>
  )
}

export const WithStateAndSubmenu: Story = { render: () => <StatefulDemo /> }
