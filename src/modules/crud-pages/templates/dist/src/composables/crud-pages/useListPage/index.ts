import { onUnmounted, ref } from 'vue'

import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'

import useCardsView from './useCardsView'
import useGenericConvert from './useGenericConvert'
import useNavigateToNewPage from './useNavigateToNewPage'
import useNavigateToViewPage from './useNavigateToViewPage'
import usePageData from './usePageData'
import usePageStatus from './usePageStatus'
import useTableView from './useTableView'

function newScope<T> () {
  const pageStatus = usePageStatus()
  const pageData = usePageData<T>(pageStatus.ready)

  const extraInitialized = ref(false)

  return {
    ...useGenericConvert<T>(),
    ...pageStatus,
    ...useTableView<T>(),
    ...useCardsView(),
    ...pageData,
    ...useNavigateToViewPage<T>(pageData.modelFindKeyField),
    ...useNavigateToNewPage(),
    extraInitialized
  }
}

class NewScopeHelper<T> {
  Return = newScope<T>()
}

export * from './useTableView'

export default function useListPage<T = unknown, TExtra = Record<string, never>> (
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<T>['Return'] & TExtra {
  const store = useSingleScopeComposableStore()

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<T>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName)
    onUnmounted(() => store.decreaseScopeUseCount(scopeName))
  }

  return store.retrieveScope(scopeName)
}
