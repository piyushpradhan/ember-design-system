import type { Meta, StoryObj } from '@storybook/react-vite'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'Primitives/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Group: Story = {
  render: () => (
    <RadioGroup name="plan">
      <Radio name="plan" value="hobby" label="Hobby" description="For tinkering — free." defaultChecked />
      <Radio name="plan" value="pro" label="Pro" description="For real work — $9/mo." />
      <Radio name="plan" value="team" label="Team" description="For teams — $29/mo." />
    </RadioGroup>
  ),
}
