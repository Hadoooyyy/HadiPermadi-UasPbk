<template>
  <AdminLayout>
    <h1>Admin Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Games</h3>
        <p>{{ games.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Rooms</h3>
        <p>{{ rooms.length }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Bookings</h3>
        <p>{{ bookings.length }}</p>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import AdminLayout from '../../components/Layout/AdminLayout.vue'
import { useGameStore } from '../../stores/game'
import { useRoomStore } from '../../stores/room'
import { useBookingStore } from '../../stores/booking'
import { onMounted } from 'vue'

const gameStore = useGameStore()
const roomStore = useRoomStore()
const bookingStore = useBookingStore()

const games = computed(() => gameStore.games)
const rooms = computed(() => roomStore.rooms)
const bookings = computed(() => bookingStore.bookings)

onMounted(async () => {
  await gameStore.fetchGames()
  await roomStore.fetchRooms()
  await bookingStore.fetchBookings()
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.stat-card {
  background-color: #3a3f44;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
}

.stat-card h3 {
  color: var(--secondary);
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
}
</style>