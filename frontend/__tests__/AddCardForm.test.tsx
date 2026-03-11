import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCardForm from '@/components/AddCardForm'

const mockDispatch = jest.fn()
const mockOnClose = jest.fn()

jest.mock('@/context/BoardContext', () => ({
  useBoard: () => ({ board: [], dispatch: mockDispatch }),
}))

beforeEach(() => {
  mockDispatch.mockClear()
  mockOnClose.mockClear()
})

describe('AddCardForm', () => {
  it('renders title input and details textarea', () => {
    render(<AddCardForm colId="col-1" onClose={mockOnClose} />)
    expect(screen.getByPlaceholderText('Card title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Details (optional)')).toBeInTheDocument()
  })

  it('does not dispatch if title is empty', async () => {
    render(<AddCardForm colId="col-1" onClose={mockOnClose} />)
    await userEvent.click(screen.getByText('Add card'))
    expect(mockDispatch).not.toHaveBeenCalled()
  })

  it('dispatches ADD_CARD and calls onClose on submit', async () => {
    render(<AddCardForm colId="col-1" onClose={mockOnClose} />)
    await userEvent.type(screen.getByPlaceholderText('Card title'), 'New task')
    await userEvent.type(screen.getByPlaceholderText('Details (optional)'), 'Some details')
    await userEvent.click(screen.getByText('Add card'))
    expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
      type: 'ADD_CARD',
      colId: 'col-1',
      title: 'New task',
      details: 'Some details',
    }))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when Cancel is clicked', async () => {
    render(<AddCardForm colId="col-1" onClose={mockOnClose} />)
    await userEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape', async () => {
    render(<AddCardForm colId="col-1" onClose={mockOnClose} />)
    await userEvent.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalled()
  })
})
