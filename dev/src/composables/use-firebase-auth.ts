import { Guid } from 'js-guid'
import { Platform } from 'quasar'
import { GoogleAuthProvider, signInWithCustomToken } from 'firebase/auth'
import { auth } from 'firebaseui'
import { UserRole } from 'models/firebase-auth'
import { getAuth } from 'services/firebase'
import { isAuthenticated, signOut, createRemoteSignInToken } from 'services/firebase-auth'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'store/index'
import { FirebaseAuthGetters } from 'store/firebase-auth'
import { computed } from 'vue'

export default function () {
  // Private

  const router = useRouter()
  const route = useRoute()
  const store = useStore()
  const remoteWindows: Record<string, { remoteWindow: Window, token: string } | undefined> = {}

  // Computed

  const authenticatedUser = computed(() =>
    store.state['firebase-auth'].currentUser ||
    (() => { throw new Error('Cannot retrieve unauthenticated user.') })())

  const isAuthenticatedComputed = computed(() => isAuthenticated(store))

  const roles = computed(() => (store.getters as FirebaseAuthGetters)['firebase-auth/currentUserRoles'])

  // Methods

  const hasRole = (role: UserRole) => roles.value.includes('admin') || roles.value.includes(role)

  const startAuthUi = (element: string | Element, uiShown?: () => void, returnUrl?: string) => {
    const uiConfig: auth.Config = {
      callbacks: {
        signInSuccessWithAuthResult: function (_authResult, redirectUrl) {
          // User successfully signed in.
          // Return type determines whether we continue the redirect automatically
          // or whether we leave that to developer to handle.
          void router.replace(redirectUrl || returnUrl?.slice(3) || '/') // Remove '?r=' from returnUrl
          return false
        },
        uiShown: uiShown
      },
      // For desktop, will use popup for IDP Providers sign-in flow instead of the default, redirect.
      signInFlow: Platform.is.desktop ? 'popup' : 'redirect',
      signInOptions: [
        {
          provider: GoogleAuthProvider.PROVIDER_ID,
          // Required to enable one-tap sign-in.
          clientId: process.env.FIREBASE_CLIENT_ID
        }
      ],
      // Terms of service url.
      tosUrl: '/auth/terms-of-service',
      // Privacy policy url.
      privacyPolicyUrl: '/auth/privacy-policy',
      // Enable one-tap sign-in.
      credentialHelper: auth.CredentialHelper.GOOGLE_YOLO
    }

    const authInstance = getAuth()
    let ui = auth.AuthUI.getInstance()

    if (!ui) {
      ui = new auth.AuthUI(authInstance)
    }

    ui.start(element, uiConfig)
  }

  function setupRemoteSignIn () {
    const handleMessage = (ev: MessageEvent<Record<'type' | 'value', string>>) => {
      if (ev.data.type === 'loginToken') {
        const loginToken = ev.data.value
        const auth = getAuth()

        signInWithCustomToken(auth, loginToken)
          .then(() => {
            void router.replace('/')
          })
          .catch(error => {
            console.error(error)
            // TODO: Show error page
          })
      }
    }

    const opener = (window.opener as Window)
    if (opener) {
      const key = route.params.key

      window.onmessage = handleMessage
      opener.postMessage({
        type: 'windowKey',
        value: key
      }, '*')
    }
  }

  function setupRemoteSignInResponse () {
    const handleMessage = (ev: MessageEvent<Record<'type' | 'value', string>>) => {
      if (ev.data.type === 'windowKey') {
        const windowKey = ev.data.value
        const item = remoteWindows[windowKey]

        remoteWindows[windowKey] = undefined
        item?.remoteWindow.postMessage({
          type: 'loginToken',
          value: item.token
        }, '*')
      }
    }

    window.onmessage = handleMessage
  }

  async function remoteNavigate (remoteSite: string) {
    const key = Guid.newGuid().toString()
    const token = await createRemoteSignInToken()

    // Safari is blocking any call to window.open() which is made inside an async call.
    // Wrapping window.open() in the async function with a setTimeout.
    // setTimeout code runs on the main thread, instead of the asynchronous one.
    setTimeout(() => {
      const remoteWindow = window.open(`${remoteSite}/auth/remote-sign-in/${key}`, '_blank')

      if (remoteWindow) {
        remoteWindows[key] = {
          remoteWindow,
          token
        }
      }
    })
  }

  return {
    authenticatedUser,
    isAuthenticated: isAuthenticatedComputed,
    roles,
    hasRole,
    startAuthUi,
    signOut,
    setupRemoteSignIn,
    setupRemoteSignInResponse,
    remoteNavigate
  }
}
