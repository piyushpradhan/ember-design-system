import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from './Carousel'

const meta: Meta<typeof Carousel> = {
  title: 'Patterns/Carousel',
  component: Carousel,
  parameters: { layout: 'centered' },
  decorators: [(S) => <div style={{ width: 360 }}><S /></div>],
}

export default meta
type Story = StoryObj<typeof Carousel>

const slideStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 180,
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-2xl)',
  color: 'var(--text-primary)',
  background: 'var(--bg-subtle)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-md)',
}

export const Basic: Story = {
  render: () => (
    <Carousel aria-label="Featured items">
      <CarouselContent>
        {[1, 2, 3, 4, 5].map((n) => (
          <CarouselItem key={n}>
            <div style={slideStyle}>Slide {n}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Loop: Story = {
  render: () => (
    <Carousel loop aria-label="Looping items">
      <CarouselContent>
        {[1, 2, 3].map((n) => (
          <CarouselItem key={n}>
            <div style={slideStyle}>Item {n}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Carousel orientation="vertical" aria-label="Vertical items">
      <CarouselContent>
        {[1, 2, 3, 4].map((n) => (
          <CarouselItem key={n}>
            <div style={slideStyle}>Row {n}</div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
}
