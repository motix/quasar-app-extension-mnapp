import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'
import useReturnUrl from 'composables/useReturnUrl'
import usePageStatus from './usePageStatus'
import usePageData from './usePageData'
import useViewer from './useViewer'
import useEditor from './useEditor'
import useDeleting from './useDeleting'
import usePageTitle from './usePageTitle'
import useMultiViews from './useMultiViews'
import useToolbar from './useToolbar'
// Main
import { onUnmounted } from 'vue'

const SCOPE_NAME = 'view-page'

function newScope<T = unknown, TVm = unknown> () {
  const {
    defaultReturnUrl: backUrl,
    returnUrl,
    goBack
  } = useReturnUrl()
  const pageStatus = usePageStatus()
  const pageData = usePageData<T, TVm>(
    goBack,
    pageStatus.muteNextRealtimeUpdate,
    pageStatus.muteViewerWatch)
  const editor = useEditor(
    pageStatus.freezed,
    pageStatus.muteNextRealtimeUpdate,
    pageStatus.editMode,
    pageData.findKey,
    pageData.modelFindKeyField,
    pageData.docKey,
    pageData.viewModel,
    pageData.updateModel,
    pageData.getModelAndViewModel)
  const deleting = useDeleting(
    goBack,
    pageStatus.freezed,
    pageStatus.muteNextRealtimeUpdate,
    pageData.docKey,
    pageData.deleteModel
  )

  return {
    backUrl,
    returnUrl,
    goBack,
    ...pageStatus,
    ...pageData,
    ...useViewer<T, TVm>(
      pageStatus.freezed,
      pageStatus.muteNextRealtimeUpdate,
      pageStatus.muteViewerWatch,
      pageStatus.editMode,
      pageData.docKey,
      pageData.model,
      pageData.viewModel,
      pageData.mapper,
      pageData.updateModel
    ),
    ...editor,
    ...deleting,
    ...usePageTitle<T>(pageData.model),
    ...useMultiViews(),
    ...useToolbar(
      pageStatus.ready,
      pageStatus.editMode,
      editor.hasEditor,
      deleting.isDeletable
    )
  }
}

class NewScopeHelper< T = unknown, TVm = unknown> {
  Return = newScope<T, TVm>()
}

export default function useViewPage<T = unknown, TVm = unknown> (hitUseCount?: boolean): NewScopeHelper<T, TVm>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(SCOPE_NAME) && store.setScope(SCOPE_NAME, newScope<T, TVm>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(SCOPE_NAME)
    onUnmounted(() => store.decreaseScopeUseCount(SCOPE_NAME))
  }

  return store.retrieveScope(SCOPE_NAME)
}
