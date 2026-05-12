import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArticleHeader } from './ArticleHeader'
import { Tag } from '../../primitives/Tag'

const meta = {
  title: 'Editorial/ArticleHeader',
  component: ArticleHeader,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ArticleHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    eyebrow: 'Recurse log 042',
    title: 'On reading 80,000 emails so you don\'t have to',
    subtitle: 'A year of triaging inbound for one founder, distilled into the patterns that actually mattered.',
    date: '2026-05-10',
    readTime: '12 min read',
    tags: (
      <>
        <Tag>email</Tag>
        <Tag>automation</Tag>
        <Tag>writing</Tag>
      </>
    ),
  },
}
