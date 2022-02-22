import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'
import usePageStatus from './usePageStatus'
import usePageData from './usePageData'
import useEditor from './useEditor'
import useNavigateToListPage from './useNavigateToListPage'
import useToolbar from './useToolbar'
// Main
import { onUnmounted } from 'vue'

const SCOPE_NAME = 'new-page'

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

export default function useNewPage<TVm = unknown> (hitUseCount?: boolean): NewScopeHelper<TVm>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(SCOPE_NAME) && store.setScope(SCOPE_NAME, newScope<TVm>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(SCOPE_NAME)
    onUnmounted(() => store.decreaseScopeUseCount(SCOPE_NAME))
  }

  return store.retrieveScope(SCOPE_NAME)
}
