<template>
  <div class="rooms">
    <h1>Gaming Rooms</h1>
    <div v-if="loading" class="loading">
      <LoadingSpinner message="Loading rooms..." />
    </div>
    <div v-else class="rooms-grid">
      <RoomCard v-for="room in rooms" :key="room.id" :room="room" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoomStore } from '../stores/room'
import RoomCard from '../components/RoomCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const roomStore = useRoomStore()
const { rooms, loading, fetchRooms } = roomStore

onMounted(() => {
  fetchRooms()
})
</script>

<style scoped>
.rooms {
  padding: 40px 0;
}

.rooms h1 {
  margin-bottom: 30px;
  font-size: 2.5rem;
  color: var(--primary);
}

.rooms-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}
</style>