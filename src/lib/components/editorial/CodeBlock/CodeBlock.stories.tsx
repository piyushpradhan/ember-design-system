import type { Meta, StoryObj } from '@storybook/react-vite'
import { CodeBlock, InlineCode } from './CodeBlock'

const meta: Meta<typeof CodeBlock> = {
  title: 'Editorial/CodeBlock',
  component: CodeBlock,
  parameters: { layout: 'padded' },
  decorators: [(S) => <div style={{ maxWidth: 680 }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof CodeBlock>

export const Default: Story = {
  args: {
    filename: 'Button.tsx',
    language: 'tsx',
    code: `import { Button } from 'ember'

export function Save() {
  return <Button onClick={save}>Save changes</Button>
}`,
  },
}

export const Inline: Story = {
  render: () => (
    <p>
      Use <InlineCode>npm install ember-design-system</InlineCode> to add the package.
    </p>
  ),
}
