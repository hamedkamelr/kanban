'use client'
import { useRef, useEffect, FormEvent } from 'react'
import { useBoard } from '@/context/BoardContext'

interface Props {
  colId: string
  onClose: () => void
}

export default function AddCardForm({ colId, onClose }: Props) {
  const { dispatch } = useBoard()
  const titleRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    titleRef.current?.focus()
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const title = (form.elements.namedItem('title') as HTMLInputElement).value.trim()
    const details = (form.elements.namedItem('details') as HTMLTextAreaElement).value.trim()
    if (!title) return
    dispatch({ type: 'ADD_CARD', colId, id: crypto.randomUUID(), title, details })
    onClose()
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-white shadow-lg overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-[#ecad0a] to-[#209dd7]" />
      <div className="p-3">
        <input
          ref={titleRef}
          name="title"
          placeholder="Card title"
          required
          className="w-full text-sm text-[#032147] font-semibold outline-none placeholder:text-[#888888] mb-2"
        />
        <textarea
          name="details"
          placeholder="Details (optional)"
          rows={2}
          className="w-full text-xs text-[#888888] resize-none outline-none placeholder:text-[#888888] border-t border-gray-100 pt-2"
        />
        <div className="flex gap-2 mt-2.5">
          <button
            type="submit"
            className="flex-1 bg-[#753991] text-white text-xs font-semibold rounded-lg py-2 hover:brightness-110 transition-all"
          >
            Add card
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 text-[#888888] text-xs font-semibold rounded-lg py-2 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
