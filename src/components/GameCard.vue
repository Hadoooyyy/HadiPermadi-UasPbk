<template>
  <div class="card">
    <img :src="game.image" :alt="game.name" class="game-image" />
    <h3>{{ game.name }}</h3>
    <p>{{ game.description }}</p>
    <p>Price: Rp{{ game.price.toLocaleString() }}</p>
    <router-link v-if="isAdmin" :to="{ name: 'game-management' }" class="btn btn-secondary">Manage</router-link>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  game: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>

<style scoped>
.game-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>