import useNewPage, { NewPage } from 'composables/crud-pages/useNewPage';
import useViewPage, { ViewPage } from 'composables/crud-pages/useViewPage';

export default function useEditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TExtra extends NonNullable<unknown> = Record<string, never>
>(newPage: boolean, scopeName: string, hitUseCount?: boolean) {
  const $p = newPage
    ? useNewPage<TVm, TExtra>(scopeName, hitUseCount)
    : useViewPage<T, TVm, TExtra>(scopeName, hitUseCount);

  return {
    $p,
    $np: $p as NewPage<TVm, TExtra>,
    $vp: $p as ViewPage<T, TVm, TExtra>,
  };
}

type Intersection<A, B> = {
  [K in keyof A & keyof B]: A[K] | B[K];
};

export type EditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TExtra extends NonNullable<unknown> = Record<string, never>
> = Intersection<NewPage<TVm, TExtra>, ViewPage<T, TVm, TExtra>> & {
  editMode: undefined | ViewPage<T, TVm, TExtra>['editMode'];
};
