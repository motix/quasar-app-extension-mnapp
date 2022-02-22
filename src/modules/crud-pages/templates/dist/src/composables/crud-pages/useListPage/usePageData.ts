import useNotifications from 'composables/useNotifications'
// Main
import { ref, computed, Ref } from 'vue'
// Types
import type { QueryConstraint } from 'firebase/firestore'
import type {
  LoadDocsPageActionPayload,
  LoadDocsPageActionMethod
} from 'services/firebase-firestore'
import type usePageStatus from './usePageStatus'

export default function usePageData<T = unknown> (
  ready: ReturnType<typeof usePageStatus>['ready']
) {
  // Private

  const {
    notifyErrorDebug,
    notifyLoadDataError
  } = useNotifications()

  // Data

  const queryConstraints = ref<QueryConstraint[]>([])
  const items = ref(null) as Ref<T[] | null>
  const allItemsLoaded = ref(false)

  // Computed

  const itemCountLabel = computed(() => items.value
    ? `${allItemsLoaded.value ? 'All ' : ''}${items.value.length} item${items.value.length > 1 ? 's' : ''} loaded`
    : undefined)

  // Methods

  async function loadFirstPage (
    loadPage: LoadDocsPageActionMethod,
    done: () => void
  ) {
    allItemsLoaded.value = false

    const payload: LoadDocsPageActionPayload = {
      page: 0,
      queryConstraints: queryConstraints.value,
      done,
      outOfRange: () => {
        items.value = []
        ready.value = true
      },
      error: (error: Error) => {
        console.error(error)
        notifyLoadDataError()
        notifyErrorDebug(error)
        items.value = []
        ready.value = true
      }
    }
    try {
      await loadPage(payload)
    } catch (error) {
      console.error(error)
      notifyErrorDebug(error)
    }
  }

  async function loadPage (
    loadPage: LoadDocsPageActionMethod,
    page: number,
    done: (stop: boolean) => void
  ) {
    const payload: LoadDocsPageActionPayload = {
      page,
      queryConstraints: queryConstraints.value,
      done: () => { done(false) },
      outOfRange: () => { done(true) },
      error: (error: Error) => {
        done(true)
        console.error(error)
        notifyLoadDataError()
        notifyErrorDebug(error)
      }
    }
    try {
      await loadPage(payload)
    } catch (error) {
      console.error(error)
      notifyErrorDebug(error)
    }
  }

  return {
    queryConstraints,
    items,
    allItemsLoaded,
    itemCountLabel,
    loadFirstPage,
    loadPage
  }
}
