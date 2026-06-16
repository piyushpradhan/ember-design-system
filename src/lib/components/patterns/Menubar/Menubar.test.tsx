import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent, within } from '@testing-library/react'
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
} from './Menubar'

function Basic() {
  return (
    <Menubar>
      <MenubarMenu value="file">
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>New tab</MenubarItem>
          <MenubarItem>New window</MenubarItem>
          <MenubarSeparator />
          <MenubarItem disabled>Print</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="edit">
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Undo</MenubarItem>
          <MenubarItem>Redo</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu value="view">
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Reload</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

describe('Menubar', () => {
  it('renders a menubar with top-level triggers', () => {
    render(<Basic />)
    expect(screen.getByRole('menubar')).toBeInTheDocument()
    expect(screen.getByText('File')).toHaveAttribute('aria-haspopup', 'menu')
    expect(screen.getByText('Edit')).toHaveAttribute('aria-haspopup', 'menu')
  })

  it('does not show any menu content initially', () => {
    render(<Basic />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens a menu when its trigger is clicked', () => {
    render(<Basic />)
    fireEvent.click(screen.getByText('File'))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('File')).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('New tab')).toBeInTheDocument()
  })

  it('clicking the open trigger again closes the menu', () => {
    render(<Basic />)
    const trigger = screen.getByText('File')
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    fireEvent.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens a menu with ArrowDown on the trigger', () => {
    render(<Basic />)
    fireEvent.keyDown(screen.getByText('Edit'), { key: 'ArrowDown' })
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByText('Undo')).toBeInTheDocument()
  })

  it('ArrowRight on a trigger moves focus to the next trigger', () => {
    render(<Basic />)
    const file = screen.getByText('File')
    file.focus()
    fireEvent.keyDown(file, { key: 'ArrowRight' })
    expect(screen.getByText('Edit')).toHaveFocus()
  })

  it('ArrowLeft wraps from the first trigger to the last', () => {
    render(<Basic />)
    const file = screen.getByText('File')
    file.focus()
    fireEvent.keyDown(file, { key: 'ArrowLeft' })
    expect(screen.getByText('View')).toHaveFocus()
  })

  it('with a menu open, ArrowRight switches the open menu to the next trigger', () => {
    render(<Basic />)
    fireEvent.click(screen.getByText('File'))
    expect(screen.getByText('New tab')).toBeInTheDocument()
    fireEvent.keyDown(screen.getByText('File'), { key: 'ArrowRight' })
    // The Edit menu should now be the open one.
    expect(screen.getByText('Undo')).toBeInTheDocument()
    expect(screen.queryByText('New tab')).not.toBeInTheDocument()
  })

  it('hovering another trigger while open switches menus', () => {
    render(<Basic />)
    fireEvent.click(screen.getByText('File'))
    expect(screen.getByText('New tab')).toBeInTheDocument()
    fireEvent.pointerEnter(screen.getByText('View'))
    expect(screen.getByText('Reload')).toBeInTheDocument()
    expect(screen.queryByText('New tab')).not.toBeInTheDocument()
  })

  it('hovering a trigger while nothing is open does not open a menu', () => {
    render(<Basic />)
    fireEvent.pointerEnter(screen.getByText('File'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders items with the right roles and disabled state', () => {
    render(<Basic />)
    fireEvent.click(screen.getByText('File'))
    const menu = screen.getByRole('menu')
    const items = within(menu).getAllByRole('menuitem')
    expect(items).toHaveLength(3)
    const print = within(menu).getByText('Print').closest('[role="menuitem"]')
    expect(print).toHaveAttribute('aria-disabled', 'true')
  })

  it('closes on Escape', () => {
    render(<Basic />)
    fireEvent.click(screen.getByText('File'))
    fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('supports checkbox and radio items', () => {
    function Demo() {
      const [checked, setChecked] = useState(false)
      const [value, setValue] = useState('a')
      return (
        <Menubar>
          <MenubarMenu value="opts">
            <MenubarTrigger>Options</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked={checked} onCheckedChange={setChecked}>
                Toggle
              </MenubarCheckboxItem>
              <MenubarRadioGroup value={value} onValueChange={setValue}>
                <MenubarRadioItem value="a">A</MenubarRadioItem>
                <MenubarRadioItem value="b">B</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )
    }
    render(<Demo />)
    fireEvent.click(screen.getByText('Options'))
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(screen.getByRole('menuitemcheckbox'))
    fireEvent.click(screen.getByText('Options'))
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true')
  })
})
