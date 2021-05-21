/// <reference types="webpack-env" />

import { Module } from 'vuex'
import { boot } from 'quasar/wrappers'
import { StateInterface } from 'store/index'
import authentication, { AuthenticationGetters } from 'store/authentication'
import { AuthenticationStateInterface } from 'store/authentication/state'
import { setStore } from 'composables/use-safe-axios'

const LOGIN_URL = '<%= prompts.loginUrl %>'

export default boot<StateInterface>(({ router, store }) => {
  // Store

  store.registerModule('authentication', authentication)

  if (process.env.DEV && module.hot) {
    module.hot.accept(['./authentication'], () => {
      // Have to add .default here due to babel 6 module output
      // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
      const newAuthentication = require('./authentication').default as Module<AuthenticationStateInterface, StateInterface>
      store.hotUpdate({ modules: { authentication: newAuthentication } })
    })
  }

  // Safe axios

  setStore(store)

  // Router

  router.addRoute({
    path: '/load-user',
    name: 'LoadUser',
    meta: {
      // Signal for return-url module
      isNoReturnPage: true
    },
    component: () => import('pages/LoadUser.vue')
  })

  router.addRoute({
    path: '/not-authenticated',
    name: 'NotAuthenticated',
    component: () => import('pages/NotAuthenticated.vue')
  })

  router.beforeEach((to, _from, next) => {
    if ((store.getters as AuthenticationGetters)['authentication/isCurrentUserLoaded']) {
      next()
    } else if (to.name === 'LoadUser' || to.name === 'NotAuthenticated') {
      next()
      if (to.name === 'LoadUser') {
        const returnLocation = (to.query.return || '/') as string
        store.dispatch('authentication/loadUser')
          .then(() => router.replace(returnLocation))
          .catch((err: { data: { status: string } }) => {
            if (err.data && err.data.status && err.data.status === 'Unauthenticated') {
              window.location.href = `${LOGIN_URL}${to.query.return ? '?returnUrl=' + (to.query.return as string) : ''}`
            } else {
              console.error(err)
              void router.replace({ name: 'NotAuthenticated' })
            }
          })
      }
    } else {
      void router.replace({ name: 'LoadUser', query: to.fullPath === '/' ? {} : { return: to.fullPath } })
    }
  })
})
