import type { Metadata } from 'next'
import './globals.css'
import { BoardProvider } from '@/context/BoardContext'

export const metadata: Metadata = {
  title: 'Kanban',
  description: 'Single-board Kanban app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BoardProvider>
          {children}
        </BoardProvider>
        <div id="modal-root" />
      </body>
    </html>
  )
}
