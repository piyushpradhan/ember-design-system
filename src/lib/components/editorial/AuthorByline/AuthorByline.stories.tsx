import type { Meta, StoryObj } from '@storybook/react-vite'
import { AuthorByline } from './AuthorByline'

const meta = {
  title: 'Editorial/AuthorByline',
  component: AuthorByline,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof AuthorByline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    name: 'Piyush Pradhan',
    role: 'Author',
    date: '2026-05-10',
  },
}
