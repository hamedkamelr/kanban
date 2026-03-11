'use client'
import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { Board } from '@/types/kanban'
import INITIAL_BOARD from '@/data/initialBoard'

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

const BoardContext = createContext<{ board: Board; dispatch: React.Dispatch<Action> } | null>(null)

export function BoardProvider({ children }: { children: ReactNode }) {
  const [board, dispatch] = useReducer(reducer, INITIAL_BOARD)
  return <BoardContext.Provider value={{ board, dispatch }}>{children}</BoardContext.Provider>
}

export function useBoard() {
  const ctx = useContext(BoardContext)
  if (!ctx) throw new Error('useBoard must be used inside BoardProvider')
  return ctx
}
