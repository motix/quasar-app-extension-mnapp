import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable'
import useReturnUrl from 'composables/useReturnUrl'
import usePageFeatures from './usePageFeatures'
import usePageStatus from './usePageStatus'
import usePageData from './usePageData'
import useViewer from './useViewer'
import useEditor from './useEditor'
import useDeleting from './useDeleting'
import usePageTitle from './usePageTitle'
import useToolbar from './useToolbar'
// Main
import { onUnmounted } from 'vue'

function newScope<T = unknown, TVm = unknown> () {
  const {
    defaultReturnUrl: backUrl,
    returnUrl,
    goBack
  } = useReturnUrl()
  const pageFeatures = usePageFeatures()
  const pageStatus = usePageStatus()
  const pageData = usePageData<T, TVm>(
    goBack,
    pageFeatures.hasEditor,
    pageStatus.muteNextRealtimeUpdate,
    pageStatus.muteViewerWatch,
    pageStatus.isDirty
  )

  return {
    backUrl,
    returnUrl,
    goBack,
    ...pageFeatures,
    ...pageStatus,
    ...pageData,
    ...useViewer<T>(
      pageStatus.freezed,
      pageStatus.muteNextRealtimeUpdate,
      pageStatus.muteViewerWatch,
      pageStatus.editMode,
      pageData.docKey,
      pageData.model,
      pageData.updateModel
    ),
    ...useEditor<TVm>(
      pageStatus.freezed,
      pageStatus.muteNextRealtimeUpdate,
      pageStatus.editMode,
      pageStatus.isDirty,
      pageData.findKey,
      pageData.modelFindKeyField,
      pageData.docKey,
      pageData.viewModel,
      pageData.updateModel,
      pageData.getModelAndViewModel
    ),
    ...useDeleting(
      goBack,
      pageStatus.freezed,
      pageStatus.muteNextRealtimeUpdate,
      pageData.docKey,
      pageData.deleteModel
    ),
    ...usePageTitle<T>(pageData.model),
    ...useToolbar(
      pageFeatures.hasEditor,
      pageFeatures.hasDeleting,
      pageStatus.ready,
      pageStatus.editMode
    )
  }
}

class NewScopeHelper< T = unknown, TVm = unknown> {
  Return = newScope<T, TVm>()
}

export default function useViewPage<T = unknown, TVm = unknown> (
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<T, TVm>['Return'] {
  const store = useSingleScopeComposableStore()

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<T, TVm>())

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName)
    onUnmounted(() => store.decreaseScopeUseCount(scopeName))
  }

  return store.retrieveScope(scopeName)
}
