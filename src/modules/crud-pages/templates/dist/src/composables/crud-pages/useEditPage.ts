import useNewPage, { NewPage } from 'composables/crud-pages/useNewPage';
import useViewPage, { ViewPage } from 'composables/crud-pages/useViewPage';

export default function useEditPage<T, TVm, TExtra = Record<string, never>>(
  newPage: boolean,
  scopeName: string,
  hitUseCount?: boolean
) {
  const $p = newPage
    ? useNewPage<TVm, TExtra>(scopeName, hitUseCount)
    : useViewPage<T, TVm, TExtra>(scopeName, hitUseCount);

  return {
    $p,
    $np: $p as NewPage<TVm, TExtra>,
    $vp: $p as ViewPage<T, TVm, TExtra>,
  };
}
