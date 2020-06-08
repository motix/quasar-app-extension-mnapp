/// <reference types="webpack-env" />

import { Store } from 'vuex'
import { boot } from 'quasar/wrappers'
import { StoreInterface } from 'store/index'
import authentication from '../store/authentication'
import { AuthenticationStateInterface } from '../store/authentication/state'

declare module 'store/index' {
  interface StoreInterface {
    authentication: AuthenticationStateInterface;
  }
}

export default boot<Store<StoreInterface>>(({ router, store }) => {
  // Store

  store.registerModule('authentication', authentication)

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./authentication'], () => {
      const newAuthentication = require('./authentication').default
      store.hotUpdate({ modules: { authentication: newAuthentication } })
    })
  }

  // Router

  router.addRoutes([
    {
      path: '/load-user',
      name: 'LoadUser',
      meta: {
        // Signal for ReturnUrl mixin
        isNoReturnPage: true
      },
      component: () => import('pages/LoadUser.vue')
    },
    {
      path: '/not-authenticated',
      name: 'NotAuthenticated',
      component: () => import('pages/NotAuthenticated.vue')
    }
  ])

  router.beforeEach((to, _, next) => {
    if (store.getters['authentication/isCurrentUserLoaded']) {
      next()
    } else if (to.name === 'LoadUser' || to.name === 'NotAuthenticated') {
      next()
      if (to.name === 'LoadUser') {
        const returnLocation = (to.query.return || '/') as string
        store.dispatch('authentication/loadUser')
          .then(() => router.replace(returnLocation))
          .catch((err: { data: { status: string } }) => {
            if (err.data && err.data.status && err.data.status === 'Unauthenticated') {
              window.location.href = `/SignIn${to.query.return ? '?returnUrl=' + to.query.return : ''}`
            } else {
              console.error(err)
              router.replace({ name: 'NotAuthenticated' })
            }
          })
      }
    } else {
      router.replace({ name: 'LoadUser', query: to.fullPath === '/' ? {} : { return: to.fullPath } })
    }
  })
})
