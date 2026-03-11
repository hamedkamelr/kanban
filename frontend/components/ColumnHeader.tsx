'use client'
import { useState, useRef, useEffect } from 'react'
import { useBoard } from '@/context/BoardContext'

interface Props {
  colId: string
  name: string
  cardCount: number
}

export default function ColumnHeader({ colId, name, cardCount }: Props) {
  const { dispatch } = useBoard()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  function commit() {
    const trimmed = value.trim()
    if (trimmed && trimmed !== name) {
      dispatch({ type: 'RENAME_COLUMN', colId, name: trimmed })
    } else {
      setValue(name)
    }
    setEditing(false)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setValue(name); setEditing(false) }
  }

  return (
    <div className="flex items-center justify-between gap-2">
      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={commit}
          onKeyDown={onKeyDown}
          className="flex-1 bg-transparent text-white font-bold text-sm border-b-2 border-[#209dd7] outline-none py-0.5 min-w-0"
          aria-label="Rename column"
        />
      ) : (
        <h2
          onDoubleClick={() => setEditing(true)}
          className="flex-1 text-white font-bold text-sm cursor-default select-none truncate min-w-0"
          title="Double-click to rename"
        >
          {name}
        </h2>
      )}
      <span className="shrink-0 text-xs font-bold text-white bg-[#753991] rounded-full w-6 h-6 flex items-center justify-center leading-none">
        {cardCount}
      </span>
    </div>
  )
}
