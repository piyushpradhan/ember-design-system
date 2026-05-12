import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Pagination } from './Pagination'

const meta: Meta<typeof Pagination> = {
  title: 'Patterns/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
}

export default meta
type Story = StoryObj<typeof Pagination>

export const Basic: Story = {
  render: () => {
    const [page, setPage] = useState(4)
    return <Pagination page={page} total={20} onPageChange={setPage} />
  },
}
