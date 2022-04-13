import { onUnmounted, ref } from 'vue';

import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable';

import useEditor from './useEditor';
import useNavigateToListPage from './useNavigateToListPage';
import usePageData from './usePageData';
import usePageStatus from './usePageStatus';

function newScope<TVm>() {
  const pageStatus = usePageStatus();
  const pageData = usePageData<TVm>();

  const extraInitialized = ref(false);

  return {
    ...pageStatus,
    ...pageData,
    ...useEditor<TVm>(
      pageStatus.freezed,
      pageData.viewModel,
      pageData.createModel
    ),
    ...useNavigateToListPage(pageStatus.isDirty),
    extraInitialized,
  };
}

class NewScopeHelper<TVm> {
  Return = newScope<TVm>();
}

export default function useNewPage<
  TVm = unknown,
  TExtra = Record<string, never>
>(
  scopeName: string,
  hitUseCount?: boolean
): NewScopeHelper<TVm>['Return'] & TExtra {
  const store = useSingleScopeComposableStore();

  !store.hasScope(scopeName) && store.setScope(scopeName, newScope<TVm>());

  if (hitUseCount === true) {
    store.increaseScopeUseCount(scopeName);
    onUnmounted(() => store.decreaseScopeUseCount(scopeName));
  }

  return store.retrieveScope(scopeName);
}

class UseNewPageHelper<TVm, TExtra> {
  Return = useNewPage<TVm, TExtra>('');
}

export type NewPage<TVm, TExtra = Record<string, never>> = UseNewPageHelper<
  TVm,
  TExtra
>['Return'];
