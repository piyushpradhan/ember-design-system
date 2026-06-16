import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
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

function Example({
  onAction,
  onCancel,
}: {
  onAction?: () => void
  onCancel?: () => void
} = {}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <button>Open</button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onAction}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

describe('AlertDialog', () => {
  it('is closed by default', () => {
    render(<Example />)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('opens when the trigger is clicked', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
  })

  it('uses role="alertdialog" with aria-modal and labelling', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    const dialog = screen.getByRole('alertdialog')
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    const title = screen.getByText('Are you sure?')
    const description = screen.getByText('This cannot be undone.')
    expect(dialog).toHaveAttribute('aria-labelledby', title.id)
    expect(dialog).toHaveAttribute('aria-describedby', description.id)
  })

  it('moves focus into the dialog on open', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    // First focusable is the Cancel button.
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Cancel' }))
  })

  it('closes on Escape', () => {
    render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes and fires the handler when Action is clicked', () => {
    let confirmed = false
    render(<Example onAction={() => (confirmed = true)} />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByText('Confirm'))
    expect(confirmed).toBe(true)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('closes and fires the handler when Cancel is clicked', () => {
    let cancelled = false
    render(<Example onCancel={() => (cancelled = true)} />)
    fireEvent.click(screen.getByText('Open'))
    fireEvent.click(screen.getByText('Cancel'))
    expect(cancelled).toBe(true)
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
  })

  it('returns focus to the trigger on close', () => {
    render(<Example />)
    const trigger = screen.getByText('Open')
    trigger.focus()
    fireEvent.click(trigger)
    fireEvent.click(screen.getByText('Cancel'))
    expect(document.activeElement).toBe(trigger)
  })

  it('does not close on backdrop click', () => {
    const { container } = render(<Example />)
    fireEvent.click(screen.getByText('Open'))
    const backdrop = document.querySelector('[class*="backdrop"]') as HTMLElement
    expect(backdrop).toBeTruthy()
    fireEvent.click(backdrop)
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    void container
  })
})
