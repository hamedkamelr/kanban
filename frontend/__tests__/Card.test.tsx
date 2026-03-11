import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Card from '@/components/Card'
import type { Card as CardType } from '@/types/kanban'

const mockDispatch = jest.fn()

jest.mock('@/context/BoardContext', () => ({
  useBoard: () => ({ board: [], dispatch: mockDispatch }),
}))

// Mock @hello-pangea/dnd Draggable to render children directly
jest.mock('@hello-pangea/dnd', () => ({
  Draggable: ({ children }: { children: (provided: object, snapshot: object) => React.ReactNode }) =>
    children(
      { innerRef: () => {}, draggableProps: {}, dragHandleProps: {} },
      { isDragging: false }
    ),
}))

beforeEach(() => {
  mockDispatch.mockClear()
  const root = document.createElement('div')
  root.id = 'modal-root'
  document.body.appendChild(root)
})

afterEach(() => {
  document.getElementById('modal-root')?.remove()
})

const card: CardType = { id: 'c1', title: 'My card', details: 'Card details' }

describe('Card', () => {
  it('renders card title and details', () => {
    render(<Card card={card} colId="col-1" index={0} />)
    expect(screen.getByText('My card')).toBeInTheDocument()
    expect(screen.getByText('Card details')).toBeInTheDocument()
  })

  it('dispatches DELETE_CARD when delete button is clicked', async () => {
    render(<Card card={card} colId="col-1" index={0} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete My card' }))
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'DELETE_CARD', colId: 'col-1', cardId: 'c1' })
  })

  it('opens modal when card body is clicked', async () => {
    render(<Card card={card} colId="col-1" index={0} />)
    await userEvent.click(screen.getByText('My card'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
})
