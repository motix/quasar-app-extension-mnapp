import { differenceBy, findIndex } from 'lodash'
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
  // Composables

  const {
    notifyErrorDebug,
    notifyLoadDataError
  } = useNotifications()

  // Data

  const queryConstraints = ref<QueryConstraint[]>([])
  const items = ref(null) as Ref<T[] | null>
  const allItemsLoaded = ref(false)
  const modelFindKeyField = ref<keyof T>('id' as keyof T) as Ref<keyof T>

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
      error: error => {
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
      error: error => {
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

  function resetItems (newItems: T[]) {
    items.value = newItems
  }

  function appendItems (newItems: T[]) {
    if (!items.value || items.value.length === 0) {
      items.value = newItems
      return
    }

    const itemsToKeep = differenceBy(items.value, newItems, modelFindKeyField.value)
    items.value = itemsToKeep.concat(newItems)
  }

  function updateItems (
    recentlyAddedDocs: T[],
    recentlyUpdatedDocs: T[],
    recentlyDeletedDocs: string[]
  ) {
    const itemsValue = items.value
    if (itemsValue) {
      itemsValue.push(...recentlyAddedDocs)

      recentlyUpdatedDocs.forEach(doc => {
        const index = findIndex(itemsValue, ['id', (doc as unknown as {id: string}).id])
        if (index > -1) {
          itemsValue[index] = doc
        }
      })

      recentlyDeletedDocs.forEach(id => {
        const index = findIndex(itemsValue, ['id', id])
        index > -1 && itemsValue.splice(index, 1)
      })

      items.value = itemsValue
    }

    recentlyAddedDocs.splice(0)
    recentlyUpdatedDocs.splice(0)
    recentlyDeletedDocs.splice(0)
  }

  return {
    queryConstraints,
    items,
    allItemsLoaded,
    modelFindKeyField,
    itemCountLabel,
    loadFirstPage,
    loadPage,
    resetItems,
    appendItems,
    updateItems
  }
}

export class UsePageDataHelper<T = unknown> {
  Return = usePageData<T>(ref(false))
}
