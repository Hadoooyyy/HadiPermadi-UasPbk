<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <h3>Admin Panel</h3>
      <ul class="sidebar-nav">
        <li>
          <router-link to="/admin" class="sidebar-link" active-class="active">Dashboard</router-link>
        </li>
        <li>
          <router-link to="/admin/games" class="sidebar-link" active-class="active">Game Management</router-link>
        </li>
        <li>
          <router-link to="/admin/rooms" class="sidebar-link" active-class="active">Room Management</router-link>
        </li>
        <li>
          <button @click="logout" class="sidebar-link">Logout</button>
        </li>
      </ul>
    </aside>
    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>