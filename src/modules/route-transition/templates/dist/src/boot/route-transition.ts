import { boot } from 'quasar/wrappers'

export default boot(({ router }) => {
  router.beforeEach((to, from) => {
    const style = document.head.appendChild(document.createElement('style'))
    style.id = 'route-transition-style'
    style.innerHTML = 'body::-webkit-scrollbar { display: none; }\nbody { -ms-overflow-style: none; scrollbar-width: none; }'

    from.meta.transitionEnter = undefined
    from.meta.transitionLeave = undefined

    if (!!from.meta.isTransitionParent && !to.meta.isTransitionParent) {
      to.meta.transitionEnter = 'animated slideInRight'
      to.meta.transitionLeave = 'animated slideOutLeft'
    } else if (!!to.meta.isTransitionParent && !from.meta.isTransitionParent) {
      to.meta.transitionEnter = 'animated slideInLeft'
      to.meta.transitionLeave = 'animated slideOutRight'
    } else {
      to.meta.transitionEnter = undefined
      to.meta.transitionLeave = undefined
    }
  })

  router.afterEach(() => {
    setTimeout(() => {
      document.getElementById('route-transition-style')?.remove()
    }, 700)
  })
})
