<template>
  <AdminLayout>
    <h1>Room Management</h1>
    <button @click="showAddForm = true" class="btn btn-primary mb-3">Add New Room</button>

    <div v-if="loading" class="loading">
      <LoadingSpinner message="Loading rooms..." />
    </div>

    <div v-else class="rooms-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="room in rooms" :key="room.id">
            <td>{{ room.id }}</td>
            <td>{{ room.name }}</td>
            <td>Rp{{ room.price.toLocaleString() }}</td>
            <td>{{ room.capacity }}</td>
            <td>
              <span :class="room.available ? 'text-success' : 'text-danger'">
                {{ room.available ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="actions">
              <button @click="editRoom(room)" class="btn btn-secondary">Edit</button>
              <button @click="deleteRoom(room.id)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Room Modal -->
    <div v-if="showAddForm || showEditForm" class="modal">
      <div class="modal-content">
        <h2>{{ showEditForm ? 'Edit Room' : 'Add New Room' }}</h2>
        <form @submit.prevent="showEditForm ? updateRoom() : createRoom()">
          <div class="form-group">
            <label for="name">Room Name</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="price">Price per hour</label>
            <input type="number" id="price" v-model="form.price" required />
          </div>
          <div class="form-group">
            <label for="capacity">Capacity</label>
            <input type="number" id="capacity" v-model="form.capacity" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="image">Image URL</label>
            <input type="text" id="image" v-model="form.image" required />
          </div>
          <div class="form-group">
            <label>
              <input type="checkbox" v-model="form.available" />
              Available
            </label>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="roomStore.loading">
              {{ roomStore.loading ? 'Processing...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import AdminLayout from '../../components/Layout/AdminLayout.vue'
import { useRoomStore } from '../../stores/room'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const roomStore = useRoomStore()
const loading = ref(false)
const showAddForm = ref(false)
const showEditForm = ref(false)
const currentRoomId = ref(null)

const form = reactive({
  name: '',
  price: 0,
  capacity: 0,
  description: '',
  image: 'https://via.placeholder.com/150',
  available: true
})

onMounted(async () => {
  loading.value = true
  await roomStore.fetchRooms()
  loading.value = false
})

const rooms = computed(() => roomStore.rooms)

function editRoom(room) {
  currentRoomId.value = room.id
  form.name = room.name
  form.price = room.price
  form.capacity = room.capacity
  form.description = room.description
  form.image = room.image
  form.available = room.available
  showEditForm.value = true
}

function resetForm() {
  form.name = ''
  form.price = 0
  form.capacity = 0
  form.description = ''
  form.image = 'https://via.placeholder.com/150'
  form.available = true
}

function closeModal() {
  showAddForm.value = false
  showEditForm.value = false
  resetForm()
}

async function createRoom() {
  try {
    await roomStore.addRoom(form)
    closeModal()
  } catch (error) {
    console.error('Failed to add room:', error)
  }
}

async function updateRoom() {
  try {
    await roomStore.updateRoom(currentRoomId.value, form)
    closeModal()
  } catch (error) {
    console.error('Failed to update room:', error)
  }
}

async function deleteRoom(id) {
  if (confirm('Are you sure you want to delete this room?')) {
    try {
      await roomStore.deleteRoom(id)
    } catch (error) {
      console.error('Failed to delete room:', error)
    }
  }
}
</script>

<style scoped>
/* Same styles as GameManagement.vue with some additions */
.rooms-table {
  margin-top: 20px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 1px solid var(--dark-soft);
}

th {
  background-color: var(--primary);
  color: white;
}

tr:hover {
  background-color: #3a3f44;
}

.actions {
  display: flex;
  gap: 10px;
}

.text-success {
  color: var(--success);
}

.text-danger {
  color: var(--danger);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #2d3436;
  padding: 30px;
  border-radius: 10px;
  width: 100%;
  max-width: 500px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.mb-3 {
  margin-bottom: 1rem;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>