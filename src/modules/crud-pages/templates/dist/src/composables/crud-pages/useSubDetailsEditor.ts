import { ComponentPublicInstance, computed, nextTick, ref, watch } from 'vue';

import useMultiViews from 'composables/useMultiViews';
import useScroll from 'composables/useScroll';

import { EditPage } from './useEditPage';

// useNewPage | useViewPage
export default function useSubDetailsEditor<
  TVm extends NonNullable<unknown>,
  TDetailVm extends NonNullable<unknown>,
  TSubDetailVm extends NonNullable<unknown>,
  TNewSubDetailParams extends Array<unknown>
>(
  $p: EditPage<never, TVm, NonNullable<unknown>>,
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
      getSubDetails($p.vm.value, detailIndex).length,
      ...params
    );
  }

  function insertSubDetail(
    detailIndex: number,
    subDetailIndex: number,
    ...params: TNewSubDetailParams
  ) {
    const subDetail = newSubDetail(...params);
    getSubDetails($p.vm.value, detailIndex).splice(
      subDetailIndex,
      0,
      subDetail
    );

    $p.dirty();

    if (isCardsView.value) {
      const unwatch = watch(
        computed(() => (subDetailEditorRefs.value[detailIndex] || []).length),
        (value) => {
          if (value >= getSubDetails($p.vm.value, detailIndex).length) {
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
    getSubDetails($p.vm.value, detailIndex).splice(subDetailIndex, 1);

    $p.dirty();
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
      $p.viewModel.value ? getDetails($p.viewModel.value).length : undefined
    ),
    () => {
      subDetailEditorRefs.value = [];
    }
  );

  function watchSubDetailsLength(detailIndex: number) {
    // Check for detail availability to avoid error throwed when an detail is deleted
    watch(
      computed(() =>
        $p.viewModel.value && getDetails($p.viewModel.value)[detailIndex]
          ? getSubDetails($p.viewModel.value, detailIndex).length
          : undefined
      ),
      () => {
        subDetailEditorRefs.value[detailIndex] = [];
      }
    );
  }

  return {
    subDetailEditorRefs,
    setSubDetailEditorRef,
    addSubDetail,
    insertSubDetail,
    removeSubDetail,
    validateSubDetailsEditor,
    watchSubDetailsLength,
  };
}
