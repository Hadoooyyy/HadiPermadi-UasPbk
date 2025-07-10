<template>
  <div class="home">
    <div class="hero">
      <h1>Welcome to GameTopup</h1>
      <p>Top up your favorite games and book gaming rooms with ease</p>
      <router-link to="/rooms" class="btn btn-primary">Explore Rooms</router-link>
    </div>

    <section class="games-section">
      <h2>Popular Games</h2>
      <div v-if="loading" class="loading">
        <LoadingSpinner message="Loading games..." />
      </div>
      <div v-else class="games-grid">
        <GameCard v-for="game in games" :key="game.id" :game="game" />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useGameStore } from '../stores/game'
import GameCard from '../components/GameCard.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const gameStore = useGameStore()
const { games, loading, fetchGames } = gameStore

onMounted(() => {
  fetchGames()
})
</script>

<style scoped>
.home {
  padding: 40px 0;
}

.hero {
  text-align: center;
  padding: 60px 0;
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('../images/ml.jpg');
  background-size: cover;
  background-position: center;
  color: white;
  margin-bottom: 40px;
  border-radius: 10px;
}

.hero h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.hero p {
  font-size: 1.2rem;
  margin-bottom: 30px;
}

.games-section {
  margin-bottom: 40px;
}

.games-section h2 {
  margin-bottom: 20px;
  font-size: 2rem;
  color: var(--primary);
}

.games-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
</style>