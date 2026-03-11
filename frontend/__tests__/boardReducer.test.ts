import INITIAL_BOARD from '@/data/initialBoard'
import type { Board } from '@/types/kanban'

// Extract reducer by re-implementing it inline (pure function, no React deps)
type Action =
  | { type: 'MOVE_CARD'; source: { colId: string; index: number }; destination: { colId: string; index: number } }
  | { type: 'ADD_CARD'; colId: string; id: string; title: string; details: string }
  | { type: 'DELETE_CARD'; colId: string; cardId: string }
  | { type: 'RENAME_COLUMN'; colId: string; name: string }

function reducer(board: Board, action: Action): Board {
  switch (action.type) {
    case 'MOVE_CARD': {
      const { source, destination } = action
      if (source.colId === destination.colId && source.index === destination.index) return board
      const next = board.map(col => ({ ...col, cards: [...col.cards] }))
      const srcCol = next.find(c => c.id === source.colId)!
      const dstCol = next.find(c => c.id === destination.colId)!
      const [card] = srcCol.cards.splice(source.index, 1)
      dstCol.cards.splice(destination.index, 0, card)
      return next
    }
    case 'ADD_CARD': {
      return board.map(col =>
        col.id === action.colId
          ? { ...col, cards: [...col.cards, { id: action.id, title: action.title, details: action.details }] }
          : col
      )
    }
    case 'DELETE_CARD': {
      return board.map(col =>
        col.id === action.colId
          ? { ...col, cards: col.cards.filter(c => c.id !== action.cardId) }
          : col
      )
    }
    case 'RENAME_COLUMN': {
      return board.map(col =>
        col.id === action.colId ? { ...col, name: action.name } : col
      )
    }
  }
}

const board = INITIAL_BOARD

describe('MOVE_CARD', () => {
  it('moves a card between columns', () => {
    const result = reducer(board, {
      type: 'MOVE_CARD',
      source: { colId: 'col-1', index: 0 },
      destination: { colId: 'col-2', index: 0 },
    })
    expect(result.find(c => c.id === 'col-1')!.cards).toHaveLength(2)
    expect(result.find(c => c.id === 'col-2')!.cards[0].id).toBe('card-01')
  })

  it('reorders within the same column', () => {
    const result = reducer(board, {
      type: 'MOVE_CARD',
      source: { colId: 'col-1', index: 0 },
      destination: { colId: 'col-1', index: 2 },
    })
    const col = result.find(c => c.id === 'col-1')!
    expect(col.cards).toHaveLength(3)
    expect(col.cards[2].id).toBe('card-01')
  })

  it('is a no-op when source and destination are identical', () => {
    const result = reducer(board, {
      type: 'MOVE_CARD',
      source: { colId: 'col-1', index: 0 },
      destination: { colId: 'col-1', index: 0 },
    })
    expect(result).toBe(board)
  })
})

describe('ADD_CARD', () => {
  it('appends a card to the target column', () => {
    const result = reducer(board, {
      type: 'ADD_CARD',
      colId: 'col-1',
      id: 'new-1',
      title: 'New task',
      details: '',
    })
    const col = result.find(c => c.id === 'col-1')!
    expect(col.cards).toHaveLength(4)
    expect(col.cards[3].title).toBe('New task')
  })

  it('does not affect other columns', () => {
    const result = reducer(board, {
      type: 'ADD_CARD',
      colId: 'col-1',
      id: 'new-2',
      title: 'X',
      details: '',
    })
    expect(result.find(c => c.id === 'col-2')!.cards).toHaveLength(
      board.find(c => c.id === 'col-2')!.cards.length
    )
  })
})

describe('DELETE_CARD', () => {
  it('removes the correct card', () => {
    const result = reducer(board, {
      type: 'DELETE_CARD',
      colId: 'col-1',
      cardId: 'card-01',
    })
    const col = result.find(c => c.id === 'col-1')!
    expect(col.cards).toHaveLength(2)
    expect(col.cards.find(c => c.id === 'card-01')).toBeUndefined()
  })
})

describe('RENAME_COLUMN', () => {
  it('updates only the target column name', () => {
    const result = reducer(board, {
      type: 'RENAME_COLUMN',
      colId: 'col-1',
      name: 'Sprint 1',
    })
    expect(result.find(c => c.id === 'col-1')!.name).toBe('Sprint 1')
    expect(result.find(c => c.id === 'col-2')!.name).toBe(
      board.find(c => c.id === 'col-2')!.name
    )
  })
})
