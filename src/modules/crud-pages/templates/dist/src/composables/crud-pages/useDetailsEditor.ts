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
  $p: Pick<
    ViewPage<never, TVm> | NewPage<TVm>,
    'ready' | 'editMode' | 'dirty' | 'viewModel' | 'vm'
  >,
  getDetails: (vm: TVm) => TDetailVm[],
  newDetail: (...params: TNewDetailParams) => TDetailVm
) {
  // Private

  function scrollToDetailEditor(index: number) {
    scrollToElement(detailEditorRefs.value[index]);
  }

  // Composables

  const { toTop: scrollToTop, toElement: scrollToElement } = useScroll();

  const { isCardsView } = useMultiViews();

  // Data

  const detailEditorRefs = ref<
    (ComponentPublicInstance & {
      validateDetailEditor(): Promise<boolean>;
    })[]
  >([]);

  // Computed

  const showAddDetailButton = computed(
    () =>
      $p.ready.value &&
      $p.editMode.value &&
      isCardsView.value &&
      getDetails($p.vm.value).length > 0
  );

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
    insertDetail(getDetails($p.vm.value).length, ...params);
  }

  function insertDetail(index: number, ...params: TNewDetailParams) {
    const detail = newDetail(...params);
    getDetails($p.vm.value).splice(index, 0, detail);

    $p.dirty();

    if (isCardsView.value) {
      const unwatch = watch(
        computed(() => detailEditorRefs.value.length),
        (value) => {
          if (value >= getDetails($p.vm.value).length) {
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
    getDetails($p.vm.value).splice(index, 1);

    $p.dirty();

    if (isCardsView.value && getDetails($p.vm.value).length === 0) {
      scrollToTop();
    }
  }

  async function validateDetailsEditor() {
    const results = await Promise.all(
      detailEditorRefs.value.map((value) => value.validateDetailEditor())
    );

    return !results.includes(false);
  }

  // Watch

  watch(
    computed(() =>
      $p.viewModel.value ? getDetails($p.viewModel.value).length : undefined
    ),
    () => {
      detailEditorRefs.value = [];
    }
  );

  return {
    detailsEditorInitialized: undefined as boolean | undefined,
    detailEditorRefs,
    showAddDetailButton,
    setDetailEditorRef,
    addDetail,
    insertDetail,
    removeDetail,
    validateDetailsEditor,
  };
}
