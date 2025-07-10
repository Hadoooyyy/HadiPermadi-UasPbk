import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Rooms from '../views/Rooms.vue'
import DetailRoom from '../views/DetailRoom.vue'
import Booking from '../views/Booking.vue'
import MyBooking from '../views/MyBooking.vue'
import Login from '../views/auth/Login.vue'
import Register from '../views/auth/Register.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import GameManagement from '../views/admin/GameManagement.vue'
import RoomManagement from '../views/admin/RoomManagement.vue'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: Rooms,
      meta: { title: 'Browse Rooms' }
    },
    {
      path: '/rooms/:id',
      name: 'room-detail',
      component: DetailRoom,
      meta: { title: 'Room Details' }
    },
    {
      path: '/booking/:roomId',
      name: 'booking',
      component: Booking,
      props: true,
      meta: { 
        requiresAuth: true,
        title: 'Book Room'
      }
    },
    {
      path: '/my-booking',
      name: 'my-booking',
      component: MyBooking,
      meta: { 
        requiresAuth: true,
        title: 'My Bookings'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      meta: { 
        requiresGuest: true,
        title: 'Login'
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      meta: { 
        requiresGuest: true,
        title: 'Register'
      }
    },
    {
      path: '/admin',
      name: 'admin-dashboard',
      component: AdminDashboard,
      meta: { 
        requiresAuth: true, 
        requiresAdmin: true,
        title: 'Admin Dashboard'
      }
    },
    {
      path: '/admin/games',
      name: 'game-management',
      component: GameManagement,
      meta: { 
        requiresAuth: true, 
        requiresAdmin: true,
        title: 'Manage Games'
      }
    },
    {
      path: '/admin/rooms',
      name: 'room-management',
      component: RoomManagement,
      meta: { 
        requiresAuth: true, 
        requiresAdmin: true,
        title: 'Manage Rooms'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  document.title = to.meta.title ? `${to.meta.title} | Gaming Room Booking` : 'Gaming Room Booking'
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'login', query: { redirect: to.fullPath } })
    return
  }
  
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next({ name: 'home' })
    return
  }
  
  if (to.meta.requiresAdmin && !authStore.user?.isAdmin) {
    next({ name: 'home' })
    return
  }
  
  next()
})

export default router