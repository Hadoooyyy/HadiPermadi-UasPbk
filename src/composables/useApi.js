import { ref } from 'vue'
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001'

export function useApi() {
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async (endpoint) => {
    try {
      loading.value = true
      error.value = null
      const response = await axios.get(`${API_BASE_URL}${endpoint}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const postData = async (endpoint, data) => {
    try {
      loading.value = true
      const response = await axios.post(`${API_BASE_URL}${endpoint}`, data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const putData = async (endpoint, data) => {
    try {
      loading.value = true
      const response = await axios.put(`${API_BASE_URL}${endpoint}`, data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const patchData = async (endpoint, data) => {
    try {
      loading.value = true
      const response = await axios.patch(`${API_BASE_URL}${endpoint}`, data)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteData = async (endpoint) => {
    try {
      loading.value = true
      const response = await axios.delete(`${API_BASE_URL}${endpoint}`)
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchData,
    postData,
    putData,
    patchData,
    deleteData
  }
}