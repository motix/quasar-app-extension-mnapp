import { onUnmounted, ref } from 'vue';

import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable';

import useReturnUrl from 'composables/useReturnUrl';

import useDeleting from './useDeleting';
import useEditor from './useEditor';
import usePageData from './usePageData';
import usePageFeatures from './usePageFeatures';
import usePageStatus from './usePageStatus';
import usePageTitle from './usePageTitle';
import useToolbar from './useToolbar';
import useViewer from './useViewer';

function newScope<T, TVm>() {
  const { defaultReturnUrl: backUrl, returnUrl, goBack } = useReturnUrl();
  const pageFeatures = usePageFeatures();
  const pageStatus = usePageStatus();
  const pageData = usePageData<T, TVm>(
    goBack,
    pageFeatures.hasEditor,
    pageStatus.muteNextRealtimeUpdate,
    pageStatus.muteViewerWatch,
    pageStatus.isDirty
  );

  const extraInitialized = ref(false);

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
      pageFeatures.hasMultiViews,
      pageStatus.ready,
      pageStatus.editMode
    ),
    extraInitialized,
  };
}

class NewScopeHelper<T, TVm> {
  Return = newScope<T, TVm>();
}

export default function useViewPage<
  T = unknown,
  TVm = unknown,
  TExtra = Record<string, never>
>(
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<T, TVm>['Return'] & TExtra {
  const store = useSingleScopeComposableStore();

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<T, TVm>());

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName);
    onUnmounted(() => store.decreaseScopeUseCount(scopeName));
  }

  return store.retrieveScope(scopeName);
}
