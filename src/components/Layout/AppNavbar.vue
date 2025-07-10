<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <router-link to="/" class="navbar-brand">GameTopup</router-link>
      <div class="navbar-nav">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/rooms" class="nav-link">Rooms</router-link>
        <template v-if="isAuthenticated">
          <router-link to="/my-booking" class="nav-link">My Booking</router-link>
          <button @click="logout" class="btn btn-secondary">Logout</button>
          <template v-if="user.role === 'admin'">
            <router-link to="/admin" class="nav-link">Admin</router-link>
          </template>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

const logout = () => {
  authStore.logout()
}
</script>