'use client'
import { useState } from 'react'
import { Draggable } from '@hello-pangea/dnd'
import type { Card as CardType } from '@/types/kanban'
import { useBoard } from '@/context/BoardContext'
import CardModal from './CardModal'

interface Props {
  card: CardType
  colId: string
  index: number
}

export default function Card({ card, colId, index }: Props) {
  const { dispatch } = useBoard()
  const [modalOpen, setModalOpen] = useState(false)

  function onDelete(e: React.MouseEvent) {
    e.stopPropagation()
    dispatch({ type: 'DELETE_CARD', colId, cardId: card.id })
  }

  return (
    <>
      <Draggable draggableId={card.id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setModalOpen(true)}
            data-testid="card"
            className={`group relative bg-white rounded-xl p-3.5 mb-2 cursor-pointer select-none transition-all duration-150 border-l-4 border-transparent ${
              snapshot.isDragging
                ? 'shadow-2xl ring-1 ring-[#209dd7] rotate-1 scale-[1.02] border-l-[#209dd7]'
                : 'shadow-sm hover:shadow-lg hover:border-l-[#ecad0a] hover:-translate-y-0.5'
            }`}
          >
            <button
              onClick={onDelete}
              aria-label={`Delete ${card.title}`}
              className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center text-[#888888] hover:text-red-500 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all text-sm leading-none"
            >
              &times;
            </button>
            <p className="text-[#032147] font-semibold text-sm pr-6 leading-snug">{card.title}</p>
            {card.details && (
              <p className="text-[#888888] text-xs mt-1.5 line-clamp-2 leading-relaxed">{card.details}</p>
            )}
          </div>
        )}
      </Draggable>
      {modalOpen && <CardModal card={card} onClose={() => setModalOpen(false)} />}
    </>
  )
}
