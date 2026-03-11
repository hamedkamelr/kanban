'use client'
import { useState } from 'react'
import { Droppable } from '@hello-pangea/dnd'
import type { Column as ColumnType } from '@/types/kanban'
import ColumnHeader from './ColumnHeader'
import Card from './Card'
import AddCardForm from './AddCardForm'

interface Props {
  column: ColumnType
}

export default function Column({ column }: Props) {
  const [addingCard, setAddingCard] = useState(false)

  return (
    <div
      data-testid="column"
      className="flex flex-col w-72 shrink-0 rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', maxHeight: 'calc(100vh - 100px)' }}
    >
      <div className="px-4 pt-4 pb-2">
        <ColumnHeader colId={column.id} name={column.name} cardCount={column.cards.length} />
      </div>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`cards-scroll flex-1 overflow-y-auto px-4 transition-colors min-h-12 ${
              snapshot.isDraggingOver ? 'bg-white/5' : ''
            }`}
          >
            {column.cards.map((card, index) => (
              <Card key={card.id} card={card} colId={column.id} index={index} />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="px-4 pb-4 pt-2">
        {addingCard ? (
          <AddCardForm colId={column.id} onClose={() => setAddingCard(false)} />
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full text-left text-[#209dd7] text-xs font-semibold py-1.5 px-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            + Add card
          </button>
        )}
      </div>
    </div>
  )
}
