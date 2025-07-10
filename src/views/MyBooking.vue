<template>
  <div class="my-booking">
    <h1>My Bookings</h1>
    
    <!-- Success message after booking -->
    <div v-if="$route.query.bookingSuccess" class="alert alert-success">
      Booking confirmed successfully!
    </div>
    
    <div v-if="loading" class="loading">
      <LoadingSpinner message="Loading your bookings..." />
    </div>
    
    <div v-else-if="error" class="error-message">
      <div class="alert alert-danger">
        {{ error }}
      </div>
    </div>
    
    <div v-else-if="bookings.length === 0" class="no-bookings">
      <p>You don't have any bookings yet.</p>
      <router-link to="/rooms" class="btn btn-primary">Browse Available Rooms</router-link>
    </div>
    
    <div v-else>
      <h2>Upcoming Bookings</h2>
      <div v-if="upcomingBookings.length === 0" class="no-upcoming">
        <p>No upcoming bookings</p>
      </div>
      <div v-else class="bookings-list">
        <div v-for="booking in upcomingBookings" :key="booking.id" class="booking-card">
          <div class="booking-header">
            <h3>{{ booking.room.name }}</h3>
            <span :class="['badge', 'status-badge', booking.status]">
              {{ booking.status }}
            </span>
          </div>
          
          <div class="booking-details">
            <div class="detail-item">
              <span class="detail-label">Game:</span>
              <span class="detail-value">{{ booking.game.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(booking.date) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Time:</span>
              <span class="detail-value">{{ booking.startTime }} - {{ booking.endTime }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">{{ booking.hours }} hour{{ booking.hours !== 1 ? 's' : '' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value">Rp{{ booking.totalPrice.toLocaleString() }}</span>
            </div>
          </div>
          
          <div class="booking-actions">
            <button 
              v-if="booking.status === 'confirmed'"
              @click="cancelBooking(booking.id)" 
              class="btn btn-danger"
              :disabled="bookingStore.loading"
            >
              Cancel Booking
            </button>
            <router-link 
              :to="{ name: 'room-detail', params: { id: booking.room.id } }" 
              class="btn btn-secondary"
            >
              View Room
            </router-link>
          </div>
        </div>
      </div>
      
      <h2 class="past-bookings-title">Past Bookings</h2>
      <div v-if="pastBookings.length === 0" class="no-past">
        <p>No past bookings</p>
      </div>
      <div v-else class="bookings-list past-bookings">
        <div v-for="booking in pastBookings" :key="booking.id" class="booking-card">
          <div class="booking-header">
            <h3>{{ booking.room.name }}</h3>
            <span :class="['badge', 'status-badge', booking.status]">
              {{ booking.status }}
            </span>
          </div>
          
          <div class="booking-details">
            <div class="detail-item">
              <span class="detail-label">Game:</span>
              <span class="detail-value">{{ booking.game.name }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Date:</span>
              <span class="detail-value">{{ formatDate(booking.date) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Duration:</span>
              <span class="detail-value">{{ booking.hours }} hour{{ booking.hours !== 1 ? 's' : '' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Total Price:</span>
              <span class="detail-value">Rp{{ booking.totalPrice.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useBookingStore } from '../stores/booking'
import { useAuthStore } from '../stores/auth'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import { format, parseISO } from 'date-fns'

const bookingStore = useBookingStore()
const authStore = useAuthStore()

const error = ref(null)

const loading = computed(() => bookingStore.loading)
const bookings = computed(() => bookingStore.bookings)
const upcomingBookings = computed(() => bookingStore.upcomingBookings)
const pastBookings = computed(() => bookingStore.pastBookings)

onMounted(async () => {
  if (!authStore.isAuthenticated) return
  
  try {
    await bookingStore.fetchUserBookings(authStore.user.id)
  } catch (err) {
    console.error('Failed to load bookings:', err)
    error.value = 'Failed to load your bookings. Please try again later.'
  }
})

function formatDate(dateString) {
  return format(parseISO(dateString), 'PPP')
}

async function cancelBooking(id) {
  if (!confirm('Are you sure you want to cancel this booking?')) return
  
  try {
    await bookingStore.cancelBooking(id)
  } catch (err) {
    console.error('Failed to cancel booking:', err)
    error.value = 'Failed to cancel booking. Please try again.'
  }
}
</script>

<style scoped>
.my-booking {
  padding: 40px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.my-booking h1 {
  margin-bottom: 30px;
  color: var(--primary);
  text-align: center;
}

.no-bookings, .no-upcoming, .no-past {
  text-align: center;
  padding: 50px 0;
  background-color: var(--dark-soft);
  border-radius: 8px;
  margin-bottom: 30px;
}

.no-bookings p, .no-upcoming p, .no-past p {
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.bookings-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.past-bookings {
  opacity: 0.8;
}

.booking-card {
  background-color: var(--dark-soft);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.booking-header h3 {
  color: var(--secondary);
  margin: 0;
}

.status-badge {
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  text-transform: capitalize;
}

.status-badge.confirmed {
  background-color: var(--success);
  color: white;
}

.status-badge.cancelled {
  background-color: var(--danger);
  color: white;
}

.status-badge.completed {
  background-color: var(--info);
  color: white;
}

.booking-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
}

.detail-label {
  font-weight: bold;
  color: var(--light);
}

.detail-value {
  color: var(--gray);
}

.booking-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.past-bookings-title {
  margin-top: 40px;
  color: var(--secondary);
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.error-message {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .my-booking {
    padding: 20px;
  }
  
  .bookings-list {
    grid-template-columns: 1fr;
  }
  
  .booking-actions {
    flex-direction: column;
  }
}
</style>