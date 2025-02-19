import type { NewPage } from 'composables/crud-pages/useNewPage';
import type { ViewPage } from 'composables/crud-pages/useViewPage';

import { computed } from 'vue';

import { useSingleScopeComposableStore } from 'stores/SingleScopeComposable';

import { defineNewPageNarrower } from 'composables/crud-pages/usePageNarrower';

export default function useEditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TNewPageExtra extends NonNullable<unknown> = Record<string, never>,
  TViewPageExtra extends NonNullable<unknown> = Record<string, never>,
>(scopeName: string) {
  // Composables

  const store = useSingleScopeComposableStore();

  !store.hasScope(scopeName) &&
    (() => {
      throw new Error(`Scope '${scopeName}' not found`);
    })();

  const $p = store.retrieveScope(scopeName) as
    | NewPage<TVm, TNewPageExtra>
    | ViewPage<T, TVm, TViewPageExtra>;

  return defineNewPageNarrower<
    NewPage<TVm, TNewPageExtra>,
    ViewPage<T, TVm, TViewPageExtra>
  >($p);
}

export function useCustomizedEditPage<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TNewPage extends NewPage<any, NonNullable<unknown>>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TViewPage extends ViewPage<any, any, NonNullable<unknown>>,
>(scopeName: string) {
  // Composables

  const store = useSingleScopeComposableStore();

  !store.hasScope(scopeName) &&
    (() => {
      throw new Error(`Scope '${scopeName}' not found`);
    })();

  const $p = store.retrieveScope(scopeName) as TNewPage | TViewPage;

  return defineNewPageNarrower<TNewPage, TViewPage>($p);
}

type Intersection<A, B> = {
  [K in keyof A & keyof B]: A[K] | B[K];
};

export type EditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TExtra extends NonNullable<unknown> = Record<string, never>,
> = Intersection<NewPage<TVm, TExtra>, ViewPage<T, TVm, TExtra>>;

export function extendEditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TExtra extends NonNullable<unknown> = Record<string, never>,
>($p: EditPage<T, TVm, TExtra>) {
  const p = $p as EditPage<T, TVm, TExtra> &
    Partial<Pick<ViewPage<T, TVm, TExtra>, 'editMode' | 'model'>>;

  // Computed

  const newPageOrEditMode = computed(() => !p.editMode || p.editMode.value);

  const activeModelOrViewModel = computed(() =>
    !p.editMode || !p.model || p.editMode.value
      ? $p.viewModel.value
      : p.model.value,
  );

  return {
    ...p,
    newPageOrEditMode,
    activeModelOrViewModel,
  };
}
