import { userRoles } from 'models/firebase-auth'
// Main
import { ref, computed } from 'vue'
import { defineStore, acceptHMRUpdate } from 'pinia'
// Types
import type { User } from 'firebase/auth'
import type { UserRole, UserClaims } from 'models/firebase-auth'

export const useFirebaseAuthStore = defineStore('FirebaseAuth', () => {
  // State

  const isAuthInitialized = ref(false)
  const currentUser = ref<User>()
  const currentUserClaims = ref<UserClaims>()

  // Getters

  const isAuthenticated = computed(() => !!currentUser.value)

  const currentUserRoles = computed(() => {
    const ret: UserRole[] = []

    if (currentUserClaims.value) {
      for (const role of userRoles) {
        if (currentUserClaims.value[role] === true) {
          ret.push(role)
        }
      }
    }

    return ret
  })

  return {
    isAuthInitialized,
    currentUser,
    currentUserClaims,
    isAuthenticated,
    currentUserRoles
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFirebaseAuthStore, import.meta.hot))
}
