import { onAuthStateChanged } from 'firebase/auth'
import { adminRole, userRole } from 'models/firebase-auth'
import { getAuth } from 'services/firebase'
import { ensureAuthInitialized, handleAuthStateChanged, isAuthenticated } from 'services/firebase-auth'
import { useFirebaseAuthStore } from 'stores/FirebaseAuth'
// Main
import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  // Router

  router.addRoute('MainLayout',
    {
      name: 'SignIn',
      path: '/auth/sign-in/:returnUrl?',
      component: () => import('pages/auth/SignIn.vue'),
      meta: { anonymous: true }
    })

  router.addRoute('MainLayout',
    {
      name: 'TermsOfService',
      path: '/auth/terms-of-service',
      component: () => import('pages/auth/TermsOfService.vue'),
      meta: { anonymous: true }
    })

  router.addRoute('MainLayout',
    {
      name: 'PrivacyPolicy',
      path: '/auth/privacy-policy',
      component: () => import('pages/auth/PrivacyPolicy.vue'),
      meta: { anonymous: true }
    })

  router.addRoute('MainLayout',
    {
      name: 'Unauthorized',
      path: '/auth/unauthorized',
      component: () => import('pages/auth/Unauthorized.vue'),
      meta: { anonymous: true }
    })

  router.addRoute('MainLayout',
    {
      name: 'SignedOut',
      path: '/auth/signed-out',
      component: () => import('pages/auth/SignedOut.vue'),
      meta: { anonymous: true }
    })

  router.addRoute('MainLayout',
    {
      name: 'RemoteSignIn',
      path: '/auth/remote-sign-in/:key',
      component: () => import('pages/auth/RemoteSignIn.vue'),
      meta: { anonymous: true }
    })

  router.beforeEach(async (to, _from, next) => {
    const store = useFirebaseAuthStore()

    // Force the app to wait until Firebase has finished its initialization
    await ensureAuthInitialized()

    if (to.name === 'SignIn' && isAuthenticated()) {
      next('/')
    } else if (to.meta.anonymous === true) {
      next()
    } else if (to.matched.some(record => record.meta.requiresAuth === true)) {
      if (isAuthenticated()) {
        const roles = store.currentUserRoles

        if (!roles.includes(adminRole)) {
          for (const record of to.matched) {
            if (record.meta.roles && record.meta.roles.length > 0) {
              if (
                !roles.includes(userRole) ||
                !record.meta.roles.some(role => roles.includes(role))
              ) {
                next({ name: 'Unauthorized' })
                return
              }
            }
          }
        }

        next()
      } else {
        // Encoded URL string placed right after '/' will be decoded by Google provider
        // when returning to SignIn page after authenticating.
        // Place it in a query string like param instead.
        const returnUrl = to.fullPath === '/' ? '' : `?r=${to.fullPath}`
        next({ name: 'SignIn', params: { returnUrl } })
      }
    } else {
      next()
    }
  })

  // Firebase Authentication

  const auth = getAuth()

  onAuthStateChanged(auth,
    user => handleAuthStateChanged(user, router),
    error => {
      console.error(error)
      // TODO: Show error page
    })
})
