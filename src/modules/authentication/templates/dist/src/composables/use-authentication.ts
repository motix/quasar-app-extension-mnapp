import { computed } from 'vue'
import { useStore } from 'vuex'
import { StateInterface } from 'store/index'

export default function () {
  const store = useStore<StateInterface>()

  const currentUser = computed(() => store.state.authentication.currentUser)

  const safeCurrentUser = computed(() => {
    if (currentUser.value === null) {
      throw new Error('currentUser is null.')
    }

    return currentUser.value
  })

  return {
    currentUser,
    safeCurrentUser
  }
}
