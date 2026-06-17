import type { Meta, StoryObj } from '@storybook/react-vite'
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './Resizable'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: 'Patterns/Resizable',
  component: ResizablePanelGroup,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

const panelBody = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  fontSize: 'var(--text-sm)',
  color: 'var(--text-secondary)',
  background: 'var(--bg-subtle)',
} as const

const frame = {
  width: 480,
  height: 240,
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
} as const

export const Horizontal: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} minSize={15}>
          <div style={panelBody}>Sidebar</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>
          <div style={panelBody}>Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={60}>
          <div style={panelBody}>Editor</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={40} minSize={20}>
          <div style={panelBody}>Terminal</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}

export const ThreePanels: Story = {
  render: () => (
    <div style={frame}>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={25} minSize={10}>
          <div style={panelBody}>Files</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div style={panelBody}>Code</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={25} minSize={10}>
          <div style={panelBody}>Preview</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  ),
}
