'use client'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { Card } from '@/types/kanban'

interface Props {
  card: Card
  onClose: () => void
}

export default function CardModal({ card, onClose }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const root = document.getElementById('modal-root')
  if (!root) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(3,33,71,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={card.title}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-[#ecad0a] via-[#209dd7] to-[#753991]" />
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-[#888888] hover:text-[#032147] hover:bg-gray-100 rounded-full transition-all text-lg leading-none"
            aria-label="Close modal"
          >
            &times;
          </button>
          <h2 className="text-[#032147] font-bold text-base pr-8 leading-snug mb-3">{card.title}</h2>
          {card.details ? (
            <p className="text-[#888888] text-sm leading-relaxed whitespace-pre-wrap">{card.details}</p>
          ) : (
            <p className="text-[#888888] text-sm italic">No details provided.</p>
          )}
        </div>
      </div>
    </div>,
    root
  )
}
