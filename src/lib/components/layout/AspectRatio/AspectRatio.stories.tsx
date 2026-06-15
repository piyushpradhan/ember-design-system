import type { Meta, StoryObj } from '@storybook/react-vite'
import { AspectRatio } from './AspectRatio'

const meta = {
  title: 'Layout/AspectRatio',
  component: AspectRatio,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof AspectRatio>

export default meta
type Story = StoryObj<typeof meta>

const Placeholder = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
      background: 'var(--bg-muted)',
      color: 'var(--text-secondary)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-sm)',
    }}
  >
    content
  </div>
)

export const Widescreen: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <AspectRatio ratio={16 / 9}>
        <Placeholder />
      </AspectRatio>
    </div>
  ),
}

export const Square: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <AspectRatio ratio={1}>
        <Placeholder />
      </AspectRatio>
    </div>
  ),
}

export const Portrait: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <AspectRatio ratio={3 / 4}>
        <Placeholder />
      </AspectRatio>
    </div>
  ),
}

export const WithImage: Story = {
  render: () => (
    <div style={{ width: 360 }}>
      <AspectRatio ratio={16 / 9}>
        <img
          src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=720"
          alt="Sky"
        />
      </AspectRatio>
    </div>
  ),
}
