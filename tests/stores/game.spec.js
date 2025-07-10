import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '../../src/stores/game'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

describe('Game Store', () => {
  let mockAxios

  beforeEach(() => {
    setActivePinia(createPinia())
    mockAxios = new MockAdapter(axios)
  })

  it('fetches games', async () => {
    const mockGames = [
      { id: 1, name: 'Game 1' },
      { id: 2, name: 'Game 2' }
    ]
    mockAxios.onGet('http://localhost:3001/games').reply(200, mockGames)

    const gameStore = useGameStore()
    await gameStore.fetchGames()

    expect(gameStore.games).toEqual(mockGames)
    expect(gameStore.loading).toBe(false)
    expect(gameStore.error).toBeNull()
  })

  it('handles fetch error', async () => {
    mockAxios.onGet('http://localhost:3001/games').reply(500)

    const gameStore = useGameStore()
    await gameStore.fetchGames()

    expect(gameStore.games).toEqual([])
    expect(gameStore.loading).toBe(false)
    expect(gameStore.error).toBeDefined()
  })

  it('adds a game', async () => {
    const newGame = { name: 'New Game', price: 100 }
    const responseGame = { id: 3, ...newGame }
    mockAxios.onPost('http://localhost:3001/games').reply(200, responseGame)

    const gameStore = useGameStore()
    gameStore.games = [{ id: 1, name: 'Game 1' }]
    const result = await gameStore.addGame(newGame)

    expect(result).toEqual(responseGame)
    expect(gameStore.games).toHaveLength(2)
    expect(gameStore.games[1]).toEqual(responseGame)
  })
})