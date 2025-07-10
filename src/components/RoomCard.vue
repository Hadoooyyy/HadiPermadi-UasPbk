<template>
  <div class="card">
    <img :src="room.image" :alt="room.name" class="room-image" />
    <h3>{{ room.name }}</h3>
    <p>{{ room.description }}</p>
    <p>Price: Rp{{ room.price.toLocaleString() }}/hour</p>
    <p>Capacity: {{ room.capacity }} people</p>
    <p :class="room.available ? 'text-success' : 'text-danger'">
      {{ room.available ? 'Available' : 'Not Available' }}
    </p>
    <div class="actions">
      <router-link :to="{ name: 'room-detail', params: { id: room.id } }">View</router-link>
      <router-link v-if="isAdmin" :to="{ name: 'room-management' }" class="btn btn-secondary">Manage</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  room: {
    type: Object,
    required: true
  }
})

const authStore = useAuthStore()
const isAdmin = computed(() => authStore.user?.role === 'admin')
</script>

<style scoped>
.room-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 10px;
}

.text-success {
  color: var(--success);
}

.text-danger {
  color: var(--danger);
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
</style>