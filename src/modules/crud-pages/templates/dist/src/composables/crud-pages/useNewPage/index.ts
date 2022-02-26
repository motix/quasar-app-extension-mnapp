import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'
import usePageStatus from './usePageStatus'
import usePageData from './usePageData'
import useEditor from './useEditor'
import useNavigateToListPage from './useNavigateToListPage'
import useToolbar from './useToolbar'
// Main
import { onUnmounted } from 'vue'

function newScope<TVm = unknown> () {
  const pageStatus = usePageStatus()
  const pageData = usePageData<TVm>()
  const editor = useEditor(
    pageStatus.freezed,
    pageData.viewModel,
    pageData.createModel)

  return {
    ...pageStatus,
    ...pageData,
    ...editor,
    ...useNavigateToListPage(
      editor.isDirty
    ),
    ...useToolbar()
  }
}

class NewScopeHelper<TVm = unknown> {
  Return = newScope<TVm>()
}

export default function useNewPage<TVm = unknown> (
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<TVm>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<TVm>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName)
    onUnmounted(() => store.decreaseScopeUseCount(scopeName))
  }

  return store.retrieveScope(scopeName)
}
