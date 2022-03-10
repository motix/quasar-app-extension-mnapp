import { createMapper } from '@automapper/core'
import { pojos } from '@automapper/pojos'
import { useStore } from 'services/firebase-firestore'
import useListPage from './useListPage'
import useListPageFilterWithOptions from './useListPageFilterWithOptions'
// Types
import type { QueryConstraint } from 'firebase/firestore'
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
  'docPage' |
  'loadDocsPage' |
  'releaseDocs'
>

class UseListPageHelper<T> {
  Return = useListPage<T>('')
}

export default function useListPageFilterWithOptionsAndStore<T extends DocModel, FilterType> (
  ready: ReturnType<typeof useListPage>['ready'],
  queryConstraints: ReturnType<typeof useListPage>['queryConstraints'],
  initialFilter: FilterType,
  store: StoreType<T>,
  loadFirstPage: ReturnType<typeof useListPage>['loadFirstPage'],
  resetItems: UseListPageHelper<T>['Return']['resetItems'],
  ...options: {
    type: FilterType,
    label: string,
    selectedLabel?: string,
    queryConstraints: QueryConstraint[]
  }[]
) {
  return useListPageFilterWithOptions<FilterType>(
    ready,
    queryConstraints,
    initialFilter,
    () => {
      store.releaseDocs({ immediately: true })

      return loadFirstPage(
        payload => store.loadDocsPage(payload),
        // done
        () => { resetItems(store.docPage(0) as T[]) }
      )
    },
    ...options
  )
}
