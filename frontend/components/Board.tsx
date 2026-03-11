'use client'
import { DragDropContext, DropResult } from '@hello-pangea/dnd'
import { useBoard } from '@/context/BoardContext'
import Column from './Column'

export default function Board() {
  const { board, dispatch } = useBoard()

  const totalCards = board.reduce((sum, col) => sum + col.cards.length, 0)

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    dispatch({
      type: 'MOVE_CARD',
      source: { colId: result.source.droppableId, index: result.source.index },
      destination: { colId: result.destination.droppableId, index: result.destination.index },
    })
  }

  return (
    <div className="h-screen bg-[#032147] flex flex-col overflow-hidden">
      <header className="shrink-0 px-8 py-4 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 rounded-full bg-[#ecad0a]" />
          <div>
            <h1 className="text-white font-bold text-xl tracking-tight leading-tight">Kanban</h1>
            <p className="text-[#888888] text-xs leading-tight">Project board</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[#888888] text-xs">{totalCards} cards</span>
          <div className="w-px h-4 bg-white/10" />
          <span className="text-[#888888] text-xs">{board.length} columns</span>
        </div>
      </header>
      <main className="flex-1 overflow-x-auto overflow-y-hidden">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 p-6 h-full items-start">
            {board.map(column => (
              <Column key={column.id} column={column} />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  )
}
