import type { Meta, StoryObj } from '@storybook/react-vite'
import { Terminal } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from './Alert'

const meta = {
  title: 'Patterns/Alert',
  component: Alert,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>You can add components to your app using the CLI.</AlertDescription>
    </Alert>
  ),
}

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 520 }}>
      <Alert variant="info">
        <AlertTitle>Informational</AlertTitle>
        <AlertDescription>A new version is available.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Saved</AlertTitle>
        <AlertDescription>Your changes have been saved successfully.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Careful</AlertTitle>
        <AlertDescription>This action may have unintended consequences.</AlertDescription>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
    </div>
  ),
}

export const CustomIcon: Story = {
  render: () => (
    <Alert variant="info" icon={<Terminal aria-hidden size={18} strokeWidth={1.75} />}>
      <AlertTitle>Run the command</AlertTitle>
      <AlertDescription>npm install ember-design-system</AlertDescription>
    </Alert>
  ),
}

export const NoIcon: Story = {
  render: () => (
    <Alert variant="success" icon={null}>
      <AlertTitle>Complete</AlertTitle>
      <AlertDescription>No icon is shown in this alert.</AlertDescription>
    </Alert>
  ),
}
