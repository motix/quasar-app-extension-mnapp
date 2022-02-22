import type { User } from 'firebase/auth'
import type { UserClaims } from 'models/firebase-auth'

function state () {
  return {
    isAuthInitialized: false,
    currentUser: null as User | null,
    currentUserClaims: null as UserClaims | null
  }
}

export type FirebaseAuthStateInterface = ReturnType<typeof state>

declare module 'store/index' {
  interface StateInterface {
    'firebase-auth': FirebaseAuthStateInterface;
  }
}

export default state
