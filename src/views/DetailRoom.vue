<template>
  <div class="detail-room">
    <div v-if="loading" class="loading">
      <LoadingSpinner message="Loading room details..." />
    </div>
    <div v-else-if="room && room.id" class="room-details">
      <div class="room-images">
        <img :src="room.image" :alt="room.name" class="main-image" />
      </div>
      <div class="room-info">
        <h1>{{ room.name }}</h1>
        <p class="price">Rp{{ room.price.toLocaleString() }} / hour</p>
        <p class="capacity">Capacity: {{ room.capacity }} people</p>
        <p :class="['availability', room.available ? 'available' : 'unavailable']">
          {{ room.available ? 'Available' : 'Not Available' }}
        </p>
        <p class="description">{{ room.description }}</p>
        <router-link 
          :to="{ name: 'booking', params: { roomId: room.id } }" 
          class="btn btn-primary"
          :disabled="!room.available"
        >
          Book Now
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useRoomStore } from '../stores/room'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const roomStore = useRoomStore()
const room = ref({})
const error = ref(null)
const loading = computed(() => roomStore.loading)

onMounted(async () => {
  try {
    const roomData = await roomStore.getRoomById(route.params.id)
    room.value = roomData
  } catch (err) {
    console.error('Error fetching room:', err)
    error.value = 'Failed to load room.'
  }
})
</script>

<style scoped>
.detail-room {
  padding: 40px 0;
}

.room-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.room-images {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.main-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 10px;
}

.room-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.room-info h1 {
  font-size: 2rem;
  color: var(--primary);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
}

.capacity {
  font-size: 1.1rem;
}

.availability {
  padding: 5px 10px;
  border-radius: 5px;
  display: inline-block;
  width: fit-content;
}

.available {
  background-color: var(--success);
  color: white;
}

.unavailable {
  background-color: var(--danger);
  color: white;
}

.description {
  line-height: 1.6;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

@media (max-width: 768px) {
  .room-details {
    grid-template-columns: 1fr;
  }
}
</style>