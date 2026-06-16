import { describe, it, expect } from 'vitest'
import { useState } from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
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
} from './DropdownMenu'

function Basic() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <button>Open</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>Billing</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

describe('DropdownMenu', () => {
  it('does not render content until opened', () => {
    render(<Basic />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens on trigger click and exposes aria attributes', () => {
    render(<Basic />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    fireEvent.click(trigger)
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('renders menuitems with the right roles', () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const items = screen.getAllByRole('menuitem')
    expect(items).toHaveLength(3)
    const billing = screen.getByText('Billing').closest('[role="menuitem"]')
    expect(billing).toHaveAttribute('aria-disabled', 'true')
  })

  it('opens via ArrowDown on the trigger', () => {
    render(<Basic />)
    const trigger = screen.getByRole('button', { name: 'Open' })
    fireEvent.keyDown(trigger, { key: 'ArrowDown' })
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('moves highlight with ArrowDown and sets aria-activedescendant', () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'ArrowDown' })
    const active = menu.getAttribute('aria-activedescendant')
    expect(active).toBeTruthy()
    const highlighted = document.querySelector('[data-highlighted="true"]')
    expect(highlighted).not.toBeNull()
  })

  it('closes when an item is selected', () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByText('Profile'))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('does not activate disabled items', () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    fireEvent.click(screen.getByText('Billing'))
    // menu stays open because disabled item did nothing
    expect(screen.getByRole('menu')).toBeInTheDocument()
  })

  it('toggles a checkbox item', () => {
    function CheckboxDemo() {
      const [checked, setChecked] = useState(false)
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button>Open</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={checked} onCheckedChange={setChecked}>
              Bookmarks
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    render(<CheckboxDemo />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const item = screen.getByRole('menuitemcheckbox')
    expect(item).toHaveAttribute('aria-checked', 'false')
    fireEvent.click(item)
    // re-open and verify state persisted
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('selects a radio item', () => {
    function RadioDemo() {
      const [value, setValue] = useState('a')
      return (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <button>Open</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value={value} onValueChange={setValue}>
              <DropdownMenuRadioItem value="a">A</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="b">B</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    render(<RadioDemo />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const radios = screen.getAllByRole('menuitemradio')
    expect(radios[0]).toHaveAttribute('aria-checked', 'true')
    fireEvent.click(radios[1])
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const after = screen.getAllByRole('menuitemradio')
    expect(after[1]).toHaveAttribute('aria-checked', 'true')
  })

  it('closes on Escape', () => {
    render(<Basic />)
    fireEvent.click(screen.getByRole('button', { name: 'Open' }))
    const menu = screen.getByRole('menu')
    fireEvent.keyDown(menu, { key: 'Escape' })
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })
})
