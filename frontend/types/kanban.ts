export interface Card {
  id: string
  title: string
  details: string
}

export interface Column {
  id: string
  name: string
  cards: Card[]
}

export type Board = Column[]
