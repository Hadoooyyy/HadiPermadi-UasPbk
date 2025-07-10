<template>
  <AppNavbar />
  <router-view />
  <AppFooter />
</template>

<script>
import AppNavbar from './components/Layout/AppNavbar.vue'
import AppFooter from './components/Layout/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppNavbar,
    AppFooter
  }
}
</script>