import type { Meta, StoryObj } from '@storybook/react-vite'
import { Accordion, AccordionItem } from './Accordion'

const meta: Meta<typeof Accordion> = {
  title: 'Patterns/Accordion',
  component: Accordion,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 520 }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Single: Story = {
  render: () => (
    <Accordion defaultValue="why">
      <AccordionItem value="why" title="Why warm neutrals?">
        Pure gray ramps feel clinical and read as "default". A slight warm shift makes the system feel inhabited and ages better on screens with different white points.
      </AccordionItem>
      <AccordionItem value="modes" title="Are light and dark equally first-class?">
        Yes. Tokens are mode-aware from the ground up. Neither mode is an inversion of the other.
      </AccordionItem>
      <AccordionItem value="weird" title="What is the 'one weird thing' clause?">
        Every product or page surface gets exactly one element that breaks the system intentionally — a handwritten note, a pixel-art easter egg, a typewriter-style date stamp.
      </AccordionItem>
    </Accordion>
  ),
}

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" defaultValue={['a', 'b']}>
      <AccordionItem value="a" title="First section">First content.</AccordionItem>
      <AccordionItem value="b" title="Second section">Second content.</AccordionItem>
      <AccordionItem value="c" title="Third section">Third content.</AccordionItem>
    </Accordion>
  ),
}
