import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  const API_URL = 'http://localhost:3001/bookings'

  const upcomingBookings = computed(() => 
    bookings.value
      .filter(b => new Date(b.date) >= new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  )
  
  const pastBookings = computed(() => 
    bookings.value
      .filter(b => new Date(b.date) < new Date())
      .sort((a, b) => new Date(b.date) - new Date(b.date))
  )

  async function fetchUserBookings(userId) {
    try {
      loading.value = true
      error.value = null
      const response = await axios.get(`${API_URL}?userId=${userId}`)
      bookings.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function createBooking(bookingData) {
    try {
      loading.value = true
      error.value = null
      
      const response = await axios.post(API_URL, bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      bookings.value.push(response.data)
      return response.data
      
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelBooking(id) {
    try {
      loading.value = true
      error.value = null
      await axios.delete(`${API_URL}/${id}`)
      bookings.value = bookings.value.filter(b => b.id !== id)
    } catch (err) {
      error.value = err.response?.data?.message || err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    bookings,
    upcomingBookings,
    pastBookings,
    loading,
    error,
    fetchUserBookings,
    createBooking,
    cancelBooking
  }
})