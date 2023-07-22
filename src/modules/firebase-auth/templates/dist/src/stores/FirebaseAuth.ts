import { computed, ref } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { User } from 'firebase/auth';

import { UserClaims, UserRole, userRoles } from 'models/firebase-auth';

export const useFirebaseAuthStore = defineStore('FirebaseAuth', () => {
  // State

  const isAuthInitialized = ref(false);
  const currentUser = ref<User | null>(null);
  const currentUserClaims = ref<UserClaims | null>(null);

  // Getters

  const isAuthenticated = computed(() => !!currentUser.value);

  const currentUserRoles = computed(() => {
    const ret: UserRole[] = [];

    if (currentUserClaims.value) {
      for (const role of userRoles) {
        if (currentUserClaims.value[role] === true) {
          ret.push(role);
        }
      }
    }

    return ret;
  });

  return {
    isAuthInitialized,
    currentUser,
    currentUserClaims,
    isAuthenticated,
    currentUserRoles,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useFirebaseAuthStore, import.meta.hot),
  );
}
