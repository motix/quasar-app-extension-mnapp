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

const SCOPE_NAME = 'list-page'

function newScope<T = unknown> () {
  const pageStatus = usePageStatus()

  return {
    ...useGenericConvert<T>(),
    ...pageStatus,
    ...useTableView<T>(),
    ...useCardsView(),
    ...usePageData<T>(pageStatus.ready),
    ...useNavigateToViewPage<T>(),
    ...useNavigateToNewPage()
  }
}

class NewScopeHelper<T = unknown> {
  Return = newScope<T>()
}

export * from './useTableView'

export default function useListPage<T = unknown> (hitUseCount?: boolean): NewScopeHelper<T>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(SCOPE_NAME) && store.setScope(SCOPE_NAME, newScope<T>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(SCOPE_NAME)
    onUnmounted(() => store.decreaseScopeUseCount(SCOPE_NAME))
  }

  return store.retrieveScope(SCOPE_NAME)
}
