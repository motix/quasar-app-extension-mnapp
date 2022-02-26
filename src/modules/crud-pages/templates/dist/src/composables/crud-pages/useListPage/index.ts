import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'
import useGenericConvert from './useGenericConvert'
import usePageStatus from './usePageStatus'
import useTableView from './useTableView'
import useCardsView from './useCardsView'
import usePageData from './usePageData'
import useNavigateToViewPage from './useNavigateToViewPage'
import useNavigateToNewPage from './useNavigateToNewPage'
// Main
import { onUnmounted } from 'vue'

function newScope<T = unknown> () {
  const pageStatus = usePageStatus()
  const pageData = usePageData<T>(pageStatus.ready)

  return {
    ...useGenericConvert<T>(),
    ...pageStatus,
    ...useTableView<T>(),
    ...useCardsView(),
    ...pageData,
    ...useNavigateToViewPage<T>(pageData.modelFindKeyField),
    ...useNavigateToNewPage()
  }
}

class NewScopeHelper<T = unknown> {
  Return = newScope<T>()
}

export * from './useTableView'

export default function useListPage<T = unknown> (
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<T>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<T>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName)
    onUnmounted(() => store.decreaseScopeUseCount(scopeName))
  }

  return store.retrieveScope(scopeName)
}
