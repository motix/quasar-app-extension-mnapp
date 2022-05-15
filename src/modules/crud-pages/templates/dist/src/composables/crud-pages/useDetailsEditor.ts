import { ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue';

import useMultiViews from 'composables/useMultiViews';
import useScroll from 'composables/useScroll';

import { NewPage } from './useNewPage';
import { ViewPage } from './useViewPage';

// useNewPage | useViewPage
export default function useDetailsEditor<
  TVm,
  TDetailVm,
  TNewDetailParams extends Array<unknown>
>(
  dirty: NewPage<TVm>['dirty'] | ViewPage<never, TVm>['dirty'],
  viewModel: NewPage<TVm>['viewModel'] | ViewPage<never, TVm>['viewModel'],
  vm: NewPage<TVm>['vm'] | ViewPage<never, TVm>['vm'],
  getDetails: (vm: TVm) => TDetailVm[],
  newDetail: (...params: TNewDetailParams) => TDetailVm
) {
  // Composables

  const { toTop: scrollToTop, toElement: scrollToElement } = useScroll();

  const { isCardsView } = useMultiViews();

  // Data

  const detailEditorRefs = ref<
    (ComponentPublicInstance & {
      validateDetailEditor(): Promise<boolean>;
    })[]
  >([]);

  // Methods

  function setDetailEditorRef(
    el: typeof detailEditorRefs.value[number] | null,
    index: number
  ) {
    if (el !== null) {
      detailEditorRefs.value[index] = el;
    }
  }

  function addDetail(...params: TNewDetailParams) {
    insertDetail(getDetails(vm.value).length, ...params);
  }

  function insertDetail(index: number, ...params: TNewDetailParams) {
    const item = newDetail(...params);
    getDetails(vm.value).splice(index, 0, item);

    dirty();

    if (isCardsView.value) {
      const unwatch = watch(
        computed(() => detailEditorRefs.value.length),
        (value) => {
          if (value >= getDetails(vm.value).length) {
            unwatch();
            nextTick(() => {
              scrollToDetailEditor(index);
            });
          }
        }
      );
    }
  }

  function removeDetail(index: number) {
    getDetails(vm.value).splice(index, 1);

    dirty();

    if (isCardsView.value && getDetails(vm.value).length === 0) {
      scrollToTop();
    }
  }

  async function validateDetailsEditor() {
    const results = await Promise.all(
      detailEditorRefs.value.map((value) => value.validateDetailEditor())
    );

    return !results.includes(false);
  }

  function scrollToDetailEditor(index: number) {
    scrollToElement(detailEditorRefs.value[index]);
  }

  // Watch

  watch(
    computed(() =>
      viewModel.value ? getDetails(viewModel.value).length : undefined
    ),
    () => {
      detailEditorRefs.value = [];
    }
  );

  return {
    detailsEditorInitialized: undefined as boolean | undefined,
    detailEditorRefs,
    setDetailEditorRef,
    addDetail,
    insertDetail,
    removeDetail,
    validateDetailsEditor,
  };
}
