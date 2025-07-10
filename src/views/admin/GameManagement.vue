<template>
  <AdminLayout>
    <h1>Game Management</h1>
    <button @click="showAddForm = true" class="btn btn-primary mb-3">Add New Game</button>

    <div v-if="loading" class="loading">
      <LoadingSpinner message="Loading games..." />
    </div>

    <div v-else class="games-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in games" :key="game.id">
            <td>{{ game.id }}</td>
            <td>{{ game.name }}</td>
            <td>Rp{{ game.price.toLocaleString() }}</td>
            <td class="actions">
              <button @click="editGame(game)" class="btn btn-secondary">Edit</button>
              <button @click="deleteGame(game.id)" class="btn btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Game Modal -->
    <div v-if="showAddForm || showEditForm" class="modal">
      <div class="modal-content">
        <h2>{{ showEditForm ? 'Edit Game' : 'Add New Game' }}</h2>
        <form @submit.prevent="showEditForm ? updateGame() : createGame()">
          <div class="form-group">
            <label for="name">Game Name</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>
          <div class="form-group">
            <label for="price">Price</label>
            <input type="number" id="price" v-model="form.price" required />
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea id="description" v-model="form.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="image">Image URL</label>
            <input type="text" id="image" v-model="form.image" required />
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="gameStore.loading">
              {{ gameStore.loading ? 'Processing...' : 'Save' }}
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
import { useGameStore } from '../../stores/game'
import LoadingSpinner from '../../components/LoadingSpinner.vue'

const gameStore = useGameStore()
const loading = ref(false)
const showAddForm = ref(false)
const showEditForm = ref(false)
const currentGameId = ref(null)

const form = reactive({
  name: '',
  price: 0,
  description: '',
  image: 'https://via.placeholder.com/150'
})

onMounted(async () => {
  loading.value = true
  await gameStore.fetchGames()
  loading.value = false
})

const games = computed(() => gameStore.games)

function editGame(game) {
  currentGameId.value = game.id
  form.name = game.name
  form.price = game.price
  form.description = game.description
  form.image = game.image
  showEditForm.value = true
}

function resetForm() {
  form.name = ''
  form.price = 0
  form.description = ''
  form.image = 'https://via.placeholder.com/150'
}

function closeModal() {
  showAddForm.value = false
  showEditForm.value = false
  resetForm()
}

async function createGame() {
  try {
    await gameStore.addGame(form)
    closeModal()
  } catch (error) {
    console.error('Failed to add game:', error)
  }
}

async function updateGame() {
  try {
    await gameStore.updateGame(currentGameId.value, form)
    closeModal()
  } catch (error) {
    console.error('Failed to update game:', error)
  }
}

async function deleteGame(id) {
  if (confirm('Are you sure you want to delete this game?')) {
    try {
      await gameStore.deleteGame(id)
    } catch (error) {
      console.error('Failed to delete game:', error)
    }
  }
}
</script>

<style scoped>
.games-table {
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