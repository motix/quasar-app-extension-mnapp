/// <reference types="webpack-env" />

import { Module } from 'vuex'
import { onAuthStateChanged } from 'firebase/auth'
import { getAuth } from 'services/firebase'
import { ensureAuthInitialized, handleAuthStateChanged, isAuthenticated } from 'services/firebase-auth'
import { StateInterface } from 'store/index'
import firebaseAuth, { FirebaseAuthGetters } from 'store/firebase-auth'
import { FirebaseAuthStateInterface } from 'store/firebase-auth/state'
import { boot } from 'quasar/wrappers'

export default boot<StateInterface>(({ router, store }) => {
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
    // Force the app to wait until Firebase has finished its initialization
    await ensureAuthInitialized(store)

    if (to.name === 'SignIn' && isAuthenticated(store)) {
      next('/')
    } else if (to.meta.anonymous === true) {
      next()
    } else if (to.matched.some(record => record.meta.requiresAuth === true)) {
      if (isAuthenticated(store)) {
        const roles = (store.getters as FirebaseAuthGetters)['firebase-auth/currentUserRoles']

        if (!roles.includes('admin')) {
          for (const record of to.matched) {
            if (record.meta.roles && record.meta.roles.length > 0) {
              if (!record.meta.roles.some(role => roles.includes(role))) {
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

  // Store

  store.registerModule('firebase-auth', firebaseAuth)

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./firebase-auth'], () => {
      // Have to add .default here due to babel 6 module output
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
      const newFirebaseAuth = require('./firebase-auth').default as Module<FirebaseAuthStateInterface, StateInterface>
      store.hotUpdate({ modules: { 'firebase-auth': newFirebaseAuth } })
    })
  }

  // Firebase Authentication

  const auth = getAuth()

  onAuthStateChanged(auth,
    user => handleAuthStateChanged(user, router, store),
    error => {
      console.error(error)
      // TODO: Show error page
    })
})
