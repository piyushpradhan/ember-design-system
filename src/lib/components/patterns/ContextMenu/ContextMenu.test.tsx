import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
} from './ContextMenu'

function Basic() {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div data-testid="zone">Right-click here</div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuLabel>Edit</ContextMenuLabel>
        <ContextMenuItem>Back</ContextMenuItem>
        <ContextMenuItem>Forward</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem disabled>Reload</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

describe('ContextMenu', () => {
  it('does not render the menu until right-clicked', () => {
    render(<Basic />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on contextmenu (right-click) and positions at the pointer', () => {
    render(<Basic />)
    fireEvent.contextMenu(screen.getByTestId('zone'), { clientX: 120, clientY: 80 })
    const menu = screen.getByRole('menu')
    expect(menu).toBeInTheDocument()
    expect(menu).toHaveStyle({ position: 'fixed', top: '80px', left: '120px' })
  })

  it('renders menuitems with the right roles', () => {
    render(<Basic />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    expect(screen.getAllByRole('menuitem')).toHaveLength(3)
    const reload = screen.getByText('Reload').closest('[role="menuitem"]')
    expect(reload).toHaveAttribute('aria-disabled', 'true')
  })

  it('moves highlight with the keyboard', () => {
    render(<Basic />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    expect(menu.getAttribute('aria-activedescendant')).toBeTruthy()
  })

  it('closes when an item is selected', () => {
    render(<Basic />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    fireEvent.click(screen.getByText('Back'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes on Escape', () => {
    render(<Basic />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('toggles a checkbox item and persists state', () => {
    function CheckboxDemo() {
      const [checked, setChecked] = useState(false)
      return (
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="zone">Zone</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Show grid
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      )
    }
    render(<CheckboxDemo />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    const item = screen.getByRole('menuitemcheckbox')
    expect(item).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(item)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('selects a radio item', () => {
    function RadioDemo() {
      const [value, setValue] = useState('a')
      return (
        <ContextMenu>
          <ContextMenuTrigger>
            <div data-testid="zone">Zone</div>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuRadioGroup value={value} onValueChange={setValue}>
              <ContextMenuRadioItem value="a">A</ContextMenuRadioItem>
              <ContextMenuRadioItem value="b">B</ContextMenuRadioItem>
            </ContextMenuRadioGroup>
          </ContextMenuContent>
        </ContextMenu>
      )
    }
    render(<RadioDemo />)
    fireEvent.contextMenu(screen.getByTestId('zone'))
    fireEvent.click(screen.getAllByRole('menuitemradio')[1])
    fireEvent.contextMenu(screen.getByTestId('zone'))
    expect(screen.getAllByRole('menuitemradio')[1]).toHaveAttribute('aria-checked', 'true')
  })
})
