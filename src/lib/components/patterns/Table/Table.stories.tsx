import type { Meta, StoryObj } from '@storybook/react-vite'
import { Table, THead, TBody, Tr, Th, Td } from './Table'
import { Badge } from '../../primitives/Badge'

const meta = {
  title: 'Patterns/Table',
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 720 }}><S /></div>],
} satisfies Meta

export default meta
type Story = StoryObj

export const Basic: Story = {
  render: () => (
    <Table>
      <THead>
        <Tr>
          <Th>Project</Th>
          <Th>Status</Th>
          <Th>Last updated</Th>
          <Th style={{ textAlign: 'right' }}>Builds</Th>
        </Tr>
      </THead>
      <TBody>
        <Tr>
          <Td>Daily Output Tracker</Td>
          <Td><Badge tone="success">Shipping</Badge></Td>
          <Td>2026-05-10</Td>
          <Td className="mono" style={{ textAlign: 'right' }}>312</Td>
        </Tr>
        <Tr>
          <Td>Smart clipboard</Td>
          <Td><Badge tone="warning">Draft</Badge></Td>
          <Td>2026-04-22</Td>
          <Td className="mono" style={{ textAlign: 'right' }}>47</Td>
        </Tr>
        <Tr>
          <Td>Financial planner</Td>
          <Td><Badge tone="neutral">Idea</Badge></Td>
          <Td>—</Td>
          <Td className="mono" style={{ textAlign: 'right' }}>0</Td>
        </Tr>
      </TBody>
    </Table>
  ),
}
