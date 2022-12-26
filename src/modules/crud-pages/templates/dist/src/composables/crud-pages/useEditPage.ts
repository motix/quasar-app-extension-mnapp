import useNewPage, { NewPage } from 'composables/crud-pages/useNewPage';
import useViewPage, { ViewPage } from 'composables/crud-pages/useViewPage';
import { computed } from 'vue';

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
> = Intersection<NewPage<TVm, TExtra>, ViewPage<T, TVm, TExtra>>;

export function extendEditPage<
  T extends NonNullable<unknown>,
  TVm extends NonNullable<unknown>,
  TExtra extends NonNullable<unknown> = Record<string, never>
>($p: EditPage<T, TVm, TExtra>) {
  const p = $p as EditPage<T, TVm, TExtra> &
    Partial<Pick<ViewPage<T, TVm, TExtra>, 'editMode' | 'model'>>;

  // Computed

  const newPageOrEditMode = computed(() => !p.editMode || p.editMode.value);

  const activeModelOrViewModel = computed(() =>
    !p.editMode || !p.model || p.editMode.value
      ? $p.viewModel.value
      : p.model.value
  );

  return {
    ...p,
    newPageOrEditMode,
    activeModelOrViewModel,
  };
}
