import { createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'
import { useStore } from 'services/firebase-firestore'
import useListPage from './useListPage'
// Main
import { onMounted, onActivated, onUnmounted } from 'vue'
// Types
import type { DocModel } from 'services/firebase-firestore'

class UseStoreHelper<T extends DocModel> {
  Return = useStore<T, never, never>(
    '', '',
    createMapper({
      name: '',
      pluginInitializer: pojos
    }),
    '', '', '')
}

type StoreType<T extends DocModel> = Pick<ReturnType<UseStoreHelper<T>['Return']>,
  'recentlyAddedDocs' |
  'recentlyUpdatedDocs' |
  'recentlyDeletedDocs' |
  'docPage' |
  'loadDocsPage' |
  'releaseDocs'
>

class UseListPageHelper<T> {
  Return = useListPage<T>('')
}

export default function useListPageStore<T extends DocModel> (
  store: StoreType<T>,
  loadPage: ReturnType<typeof useListPage>['loadPage'],
  appendItems: UseListPageHelper<T>['Return']['appendItems'],
  updateItems: UseListPageHelper<T>['Return']['updateItems'],
  loadOnMounted?: {
    ready: ReturnType<typeof useListPage>['ready'];
    loadFirstPage: ReturnType<typeof useListPage>['loadFirstPage'];
    resetItems: UseListPageHelper<T>['Return']['resetItems'];
  }
) {
  // Methods

  function onLoadNextPage (index: number, done: (stop: boolean) => void) {
    void loadPage(
      payload => store.loadDocsPage(payload),
      index,
      // done
      stop => {
        appendItems(store.docPage(index) as T[])
        done(stop)
      })
  }

  // Lifecycle Hooks

  if (loadOnMounted) {
    onMounted(() => {
      void loadOnMounted.loadFirstPage(
        payload => store.loadDocsPage(payload),
        // done
        () => {
          loadOnMounted.resetItems(store.docPage(0) as T[])
          loadOnMounted.ready.value = true
        }
      )
    })
  }

  onActivated(() => {
    updateItems(
      store.recentlyAddedDocs as T[],
      store.recentlyUpdatedDocs as T[],
      store.recentlyDeletedDocs
    )
  })

  onUnmounted(() => {
    store.releaseDocs({ immediately: false })
  })

  return {
    store,
    onLoadNextPage
  }
}
