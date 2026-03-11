import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardModal from '@/components/CardModal'
import type { Card } from '@/types/kanban'

const mockOnClose = jest.fn()

const card: Card = { id: 'c1', title: 'Test card', details: 'Some details here' }

beforeEach(() => {
  mockOnClose.mockClear()
  // portal target
  const root = document.createElement('div')
  root.id = 'modal-root'
  document.body.appendChild(root)
})

afterEach(() => {
  document.getElementById('modal-root')?.remove()
})

describe('CardModal', () => {
  it('renders card title and details', () => {
    render(<CardModal card={card} onClose={mockOnClose} />)
    expect(screen.getByText('Test card')).toBeInTheDocument()
    expect(screen.getByText('Some details here')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', async () => {
    render(<CardModal card={card} onClose={mockOnClose} />)
    await userEvent.click(screen.getByRole('dialog'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when Escape is pressed', async () => {
    render(<CardModal card={card} onClose={mockOnClose} />)
    await userEvent.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', async () => {
    render(<CardModal card={card} onClose={mockOnClose} />)
    await userEvent.click(screen.getByRole('button', { name: 'Close modal' }))
    expect(mockOnClose).toHaveBeenCalled()
  })
})
