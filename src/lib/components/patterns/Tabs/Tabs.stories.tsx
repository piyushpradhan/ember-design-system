import type { Meta, StoryObj } from '@storybook/react-vite'
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Patterns/Tabs',
  component: Tabs,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 480 }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Basic: Story = {
  render: () => (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="usage">Usage</TabsTrigger>
        <TabsTrigger value="api">API</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">A condensed summary of what this thing does and why.</TabsContent>
      <TabsContent value="usage">How to install, import and render. Short examples preferred.</TabsContent>
      <TabsContent value="api">Props, types, refs. Reference grade — terse and complete.</TabsContent>
    </Tabs>
  ),
}
