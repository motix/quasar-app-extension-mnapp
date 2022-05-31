import { ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue';

import useMultiViews from 'composables/useMultiViews';
import useScroll from 'composables/useScroll';

import { NewPage } from './useNewPage';
import { ViewPage } from './useViewPage';

// useNewPage | useViewPage
export default function useSubDetailsEditor<
  TVm,
  TDetailVm,
  TSubDetailVm,
  TNewSubDetailParams extends Array<unknown>
>(
  dirty: NewPage<TVm>['dirty'] | ViewPage<never, TVm>['dirty'],
  viewModel: NewPage<TVm>['viewModel'] | ViewPage<never, TVm>['viewModel'],
  vm: NewPage<TVm>['vm'] | ViewPage<never, TVm>['vm'],
  getDetails: (vm: TVm) => TDetailVm[],
  getSubDetails: (vm: TVm, detailIndex: number) => TSubDetailVm[],
  newSubDetail: (...params: TNewSubDetailParams) => TSubDetailVm
) {
  // Private

  function scrollToSubDetailEditor(
    detailIndex: number,
    subDetailIndex: number
  ) {
    scrollToElement(subDetailEditorRefs.value[detailIndex][subDetailIndex]);
  }

  // Composables

  const { toElement: scrollToElement } = useScroll();

  const { isCardsView } = useMultiViews();

  // Data

  const subDetailEditorRefs = ref<
    (ComponentPublicInstance & {
      validateSubDetailEditor(): Promise<boolean>;
    })[][]
  >([]);

  // Methods

  function setSubDetailEditorRef(
    el: typeof subDetailEditorRefs.value[number][number] | null,
    detailIndex: number,
    subDetailIndex: number
  ) {
    if (el !== null) {
      subDetailEditorRefs.value[detailIndex] ||= [];
      subDetailEditorRefs.value[detailIndex][subDetailIndex] = el;
    }
  }

  function addSubDetail(detailIndex: number, ...params: TNewSubDetailParams) {
    insertSubDetail(
      detailIndex,
      getSubDetails(vm.value, detailIndex).length,
      ...params
    );
  }

  function insertSubDetail(
    detailIndex: number,
    subDetailIndex: number,
    ...params: TNewSubDetailParams
  ) {
    const subDetail = newSubDetail(...params);
    getSubDetails(vm.value, detailIndex).splice(subDetailIndex, 0, subDetail);

    dirty();

    if (isCardsView.value) {
      const unwatch = watch(
        computed(() => (subDetailEditorRefs.value[detailIndex] || []).length),
        (value) => {
          if (value >= getSubDetails(vm.value, detailIndex).length) {
            unwatch();
            nextTick(() => {
              scrollToSubDetailEditor(detailIndex, subDetailIndex);
            });
          }
        }
      );
    }
  }

  function removeSubDetail(detailIndex: number, subDetailIndex: number) {
    getSubDetails(vm.value, detailIndex).splice(subDetailIndex, 1);

    dirty();
  }

  async function validateSubDetailsEditor(detailIndex: number) {
    const results = await Promise.all(
      (subDetailEditorRefs.value[detailIndex] || []).map((value) =>
        value.validateSubDetailEditor()
      )
    );

    return !results.includes(false);
  }

  // Watch

  watch(
    computed(() =>
      viewModel.value ? getDetails(viewModel.value).length : undefined
    ),
    () => {
      subDetailEditorRefs.value = [];
    }
  );

  function watchSubDetailsLength(detailIndex: number) {
    // Check for detail availability to avoid error throwed when an detail is deleted
    watch(
      computed(() =>
        viewModel.value && getDetails(viewModel.value)[detailIndex]
          ? getSubDetails(viewModel.value, detailIndex).length
          : undefined
      ),
      () => {
        subDetailEditorRefs.value[detailIndex] = [];
      }
    );
  }

  return {
    subDetailsEditorInitialized: undefined as boolean | undefined,
    subDetailEditorRefs,
    setSubDetailEditorRef,
    addSubDetail,
    insertSubDetail,
    removeSubDetail,
    validateSubDetailsEditor,
    watchSubDetailsLength,
  };
}