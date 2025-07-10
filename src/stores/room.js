import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRoomStore = defineStore('room', () => {
  const rooms = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchRooms() {
    try {
      loading.value = true
      const response = await axios.get('http://localhost:3001/rooms')
      rooms.value = response.data
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  async function getRoomById(id) {
    try {
      loading.value = true
      const response = await axios.get(`http://localhost:3001/rooms/${id}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function addRoom(room) {
    try {
      loading.value = true
      const response = await axios.post('http://localhost:3001/rooms', room)
      rooms.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateRoom(id, room) {
    try {
      loading.value = true
      const response = await axios.put(`http://localhost:3001/rooms/${id}`, room)
      const index = rooms.value.findIndex(r => r.id === id)
      if (index !== -1) {
        rooms.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteRoom(id) {
    try {
      loading.value = true
      await axios.delete(`http://localhost:3001/rooms/${id}`)
      rooms.value = rooms.value.filter(r => r.id !== id)
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    getRoomById,
    addRoom,
    updateRoom,
    deleteRoom
  }
})