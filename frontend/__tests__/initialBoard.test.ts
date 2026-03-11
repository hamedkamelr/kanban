import INITIAL_BOARD from '@/data/initialBoard'

describe('INITIAL_BOARD', () => {
  it('has exactly 5 columns', () => {
    expect(INITIAL_BOARD).toHaveLength(5)
  })

  it('every column has id and name', () => {
    INITIAL_BOARD.forEach(col => {
      expect(col.id).toBeTruthy()
      expect(col.name).toBeTruthy()
    })
  })

  it('every card has id, title, and details keys', () => {
    INITIAL_BOARD.forEach(col => {
      col.cards.forEach(card => {
        expect(card.id).toBeTruthy()
        expect(card.title).toBeTruthy()
        expect(typeof card.details).toBe('string')
      })
    })
  })

  it('all card ids are unique', () => {
    const ids = INITIAL_BOARD.flatMap(col => col.cards.map(c => c.id))
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has at least 10 cards in total', () => {
    const total = INITIAL_BOARD.reduce((sum, col) => sum + col.cards.length, 0)
    expect(total).toBeGreaterThanOrEqual(10)
  })
})
