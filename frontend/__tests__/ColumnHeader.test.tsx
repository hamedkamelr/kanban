import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ColumnHeader from '@/components/ColumnHeader'

const mockDispatch = jest.fn()

jest.mock('@/context/BoardContext', () => ({
  useBoard: () => ({ board: [], dispatch: mockDispatch }),
}))

beforeEach(() => mockDispatch.mockClear())

describe('ColumnHeader', () => {
  it('renders the column name', () => {
    render(<ColumnHeader colId="col-1" name="Backlog" cardCount={3} />)
    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })

  it('renders the card count badge', () => {
    render(<ColumnHeader colId="col-1" name="Backlog" cardCount={3} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('switches to input on double-click', async () => {
    render(<ColumnHeader colId="col-1" name="Backlog" cardCount={3} />)
    await userEvent.dblClick(screen.getByText('Backlog'))
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('dispatches RENAME_COLUMN on Enter with new name', async () => {
    render(<ColumnHeader colId="col-1" name="Backlog" cardCount={3} />)
    await userEvent.dblClick(screen.getByText('Backlog'))
    const input = screen.getByRole('textbox')
    await userEvent.clear(input)
    await userEvent.type(input, 'Sprint 1')
    await userEvent.keyboard('{Enter}')
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'RENAME_COLUMN', colId: 'col-1', name: 'Sprint 1' })
  })

  it('cancels rename on Escape without dispatching', async () => {
    render(<ColumnHeader colId="col-1" name="Backlog" cardCount={3} />)
    await userEvent.dblClick(screen.getByText('Backlog'))
    await userEvent.keyboard('{Escape}')
    expect(mockDispatch).not.toHaveBeenCalled()
    expect(screen.getByText('Backlog')).toBeInTheDocument()
  })
})
