import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useApi } from '../composables/useApi'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const isAuthenticated = ref(!!localStorage.getItem('user'))
  const { fetchData } = useApi()
  const router = useRouter()

  const login = async (username, password) => {
    try {
      const users = await fetchData('/users')
      const foundUser = users.find(u => u.username === username && u.password === password)

      if (foundUser) {
        if (!foundUser.createdAt) {
          foundUser.createdAt = new Date().toISOString()
        }
        setUser(foundUser)
        await router.push(foundUser.role === 'admin' ? '/admin' : '/')
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('user')
    router.push('/login')
  }

  const setUser = (userData) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('user', JSON.stringify(userData))
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    setUser
  }
})
