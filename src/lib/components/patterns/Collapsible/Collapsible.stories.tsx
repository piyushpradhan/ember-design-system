import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { ChevronsUpDown } from 'lucide-react'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './Collapsible'
import { Button } from '../../primitives/Button'

const meta: Meta<typeof Collapsible> = {
  title: 'Patterns/Collapsible',
  component: Collapsible,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Collapsible>

const panelStyle = {
  marginTop: 'var(--space-2)',
  padding: 'var(--space-3) var(--space-4)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-md)',
  background: 'var(--bg-subtle)',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-secondary)',
} as const

export const Default: Story = {
  render: () => (
    <Collapsible style={{ width: 320 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <strong style={{ fontSize: 'var(--text-sm)' }}>@ember starred 3 repositories</strong>
        <CollapsibleTrigger>
          <Button variant="ghost" size="sm" aria-label="Toggle">
            <ChevronsUpDown size={16} aria-hidden />
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div style={panelStyle}>@radix-ui/primitives</div>
        <div style={panelStyle}>@stitches/react</div>
        <div style={panelStyle}>@ember/design-system</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}

function ControlledDemo() {
  const [open, setOpen] = useState(true)
  return (
    <div style={{ width: 320, display: 'grid', gap: 'var(--space-2)' }}>
      <Button variant="secondary" size="sm" onClick={() => setOpen((o) => !o)}>
        External toggle ({open ? 'open' : 'closed'})
      </Button>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger>
          <Button variant="ghost" size="sm">
            Trigger
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div style={panelStyle}>Controlled content stays in sync with external state.</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

export const Controlled: Story = {
  render: () => <ControlledDemo />,
}

export const Disabled: Story = {
  render: () => (
    <Collapsible disabled style={{ width: 320 }}>
      <CollapsibleTrigger>
        <Button variant="ghost" size="sm">
          Disabled trigger
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div style={panelStyle}>You should not be able to open this.</div>
      </CollapsibleContent>
    </Collapsible>
  ),
}
