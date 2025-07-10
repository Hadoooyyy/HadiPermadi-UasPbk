<template>
  <div class="booking">
    <h1>Book Gaming Room</h1>
    
    <!-- Loading State -->
    <div v-if="loadingRoom || loadingGames" class="loading">
      <LoadingSpinner message="Loading data..." />
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="error-message">
      <div class="alert alert-danger">
        {{ error }}
        <router-link v-if="error === 'Room not found'" to="/rooms" class="alert-link">
          Browse available rooms
        </router-link>
      </div>
    </div>
    
    <!-- Booking Form -->
    <div v-else class="booking-form">
      <div class="room-info">
        <h2>{{ room.name }}</h2>
        <p>Price: Rp{{ room.price.toLocaleString() }}/hour</p>
        <p v-if="!room.available" class="text-danger">This room is currently unavailable</p>
      </div>

      <form @submit.prevent="handleSubmit" class="booking-form-content">
        <!-- Game Selection -->
        <div class="form-group">
          <label for="game">Select Game</label>
          <select 
            id="game" 
            v-model="form.gameId" 
            class="form-control"
            required
            :disabled="!room.available"
            @change="updateTotalPrice"
          >
            <option value="" disabled>Select a game</option>
            <option 
              v-for="game in availableGames" 
              :key="game.id" 
              :value="game.id"
              :disabled="!game.available"
            >
              {{ game.name }} (Rp{{ game.price.toLocaleString() }})
              <span v-if="!game.available"> - Unavailable</span>
            </option>
          </select>
        </div>

        <!-- Date Selection -->
        <div class="form-group">
          <label for="date">Booking Date</label>
          <input 
            type="date" 
            id="date" 
            v-model="form.date" 
            class="form-control"
            :min="minDate"
            :max="maxDate"
            required
            :disabled="!room.available"
            @change="validateDate"
          />
          <small class="form-text text-muted">
            Bookings available from {{ minDate }} to {{ maxDate }}
          </small>
          <small v-if="dateError" class="text-danger">{{ dateError }}</small>
        </div>

        <!-- Duration Selection -->
        <div class="form-group">
          <label for="hours">Duration (hours)</label>
          <input 
            type="number" 
            id="hours" 
            v-model.number="form.hours" 
            class="form-control"
            min="1" 
            :max="maxHours"
            required
            :disabled="!room.available"
            @input="updateTotalPrice"
          />
          <small class="form-text text-muted">
            Maximum {{ maxHours }} hours per booking
          </small>
        </div>

        <!-- Total Price Display -->
        <div class="form-group">
          <label>Total Price</label>
          <p class="total-price">Rp{{ totalPrice.toLocaleString() }}</p>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <router-link 
            :to="{ name: 'room-detail', params: { id: room.id } }" 
            class="btn btn-secondary"
          >
            Back to Room
          </router-link>
          <button 
            type="submit" 
            class="btn btn-primary"
            :disabled="!isFormValid || bookingStore.loading || !room.available"
          >
            <span v-if="bookingStore.loading">
              <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Processing...
            </span>
            <span v-else>Confirm Booking</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRoomStore } from '../stores/room'
import { useGameStore } from '../stores/game'
import { useBookingStore } from '../stores/booking'
import { useAuthStore } from '../stores/auth'
import { format, addDays } from 'date-fns'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const route = useRoute()
const router = useRouter()
const roomStore = useRoomStore()
const gameStore = useGameStore()
const bookingStore = useBookingStore()
const authStore = useAuthStore()

const room = ref({})
const loading = ref(false)
const error = ref(null)

// Form data
const form = reactive({
  gameId: '',
  date: '',
  hours: 1
})

// Date configuration
const today = new Date()
const minDate = format(today, 'yyyy-MM-dd')
const maxDate = format(addDays(today, 30), 'yyyy-MM-dd')

// Computed properties
const totalPrice = computed(() => {
  if (!room.value.price || !form.hours) return 0
  
  const selectedGame = gameStore.games.find(g => g.id === parseInt(form.gameId))
  const gamePrice = selectedGame ? selectedGame.price : 0
  
  return (room.value.price * form.hours) + gamePrice
})

const isFormValid = computed(() => {
  return form.gameId && 
         form.date && 
         form.hours >= 1 && 
         form.hours <= 8
})

onMounted(async () => {
  try {
    loading.value = true
    
    // Load room data
    const roomData = await roomStore.getRoomById(route.params.roomId)
    if (!roomData) {
      error.value = 'Room not found'
      return
    }
    room.value = roomData
    
    // Load games if not loaded
    if (gameStore.games.length === 0) {
      await gameStore.fetchGames()
    }
    
    // Set default date to tomorrow
    form.date = format(addDays(today, 1), 'yyyy-MM-dd')
    
  } catch (err) {
    console.error('Failed to load data:', err)
    error.value = err.message || 'Failed to load data'
    toast.error('Failed to load booking data')
  } finally {
    loading.value = false
  }
})

async function handleSubmit() {
  if (!isFormValid.value) {
    toast.warning('Please fill all fields correctly')
    return
  }

  try {
    const bookingData = {
      userId: authStore.user.id,
      roomId: room.value.id,
      gameId: parseInt(form.gameId),
      date: form.date,
      hours: parseInt(form.hours),
      totalPrice: totalPrice.value,
      status: 'pending' // Ubah ke 'confirmed' jika ingin langsung konfirm
    }

    const response = await bookingStore.createBooking(bookingData)
    
    if (response) {
      toast.success('Booking created successfully!')
      router.push({ 
        name: 'my-booking',
        query: { bookingSuccess: true }
      })
    }
  } catch (err) {
    console.error('Booking error:', err)
    error.value = err.response?.data?.message || err.message || 'Booking failed'
    toast.error('Failed to create booking')
  }
}
</script>

<style scoped>
.booking {
  padding: 40px 0;
  max-width: 800px;
  margin: 0 auto;
}

.booking h1 {
  margin-bottom: 30px;
  color: var(--primary);
  text-align: center;
}

.booking-form {
  background-color: var(--dark-soft);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.room-info {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--dark-light);
}

.room-info h2 {
  color: var(--secondary);
  margin-bottom: 10px;
}

.booking-form-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-control {
  padding: 10px 15px;
  border-radius: 5px;
  border: 1px solid var(--dark-light);
  background-color: var(--dark);
  color: white;
}

.total-price {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--primary);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.error-message {
  margin-bottom: 30px;
}

@media (max-width: 768px) {
  .booking {
    padding: 20px;
  }
  
  .booking-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 10px;
  }
}
</style>