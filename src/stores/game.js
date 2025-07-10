import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useGameStore = defineStore('game', () => {
  const games = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchGames() {
    try {
      loading.value = true
      const response = await axios.get('http://localhost:3001/games')
      games.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function addGame(game) {
    try {
      loading.value = true
      const response = await axios.post('http://localhost:3001/games', game)
      games.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateGame(id, game) {
    try {
      loading.value = true
      const response = await axios.put(`http://localhost:3001/games/${id}`, game)
      const index = games.value.findIndex(g => g.id === id)
      if (index !== -1) {
        games.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteGame(id) {
    try {
      loading.value = true
      await axios.delete(`http://localhost:3001/games/${id}`)
      games.value = games.value.filter(g => g.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    games,
    loading,
    error,
    fetchGames,
    addGame,
    updateGame,
    deleteGame
  }
})