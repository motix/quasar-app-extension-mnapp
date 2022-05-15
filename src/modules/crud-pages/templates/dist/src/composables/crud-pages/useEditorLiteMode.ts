import { computed, nextTick, ref, watch } from 'vue';

import useNotifications from 'composables/useNotifications';

import StickyHeaders from 'components/shared/StickyHeaders.vue';

import useNewPage from './useNewPage';
import useViewPage from './useViewPage';

// useNewPage | useViewPage
export default function useEditorLiteMode(
  ready:
    | ReturnType<typeof useNewPage>['ready']
    | ReturnType<typeof useViewPage>['ready'],
  editMode: undefined | ReturnType<typeof useViewPage>['editMode'],
  dirty:
    | ReturnType<typeof useNewPage>['dirty']
    | ReturnType<typeof useViewPage>['dirty'],
  validateFullModeEditor: () => Promise<boolean>,
  validateLiteModeEditor: () => Promise<boolean>,
  resetInputs: () => void
) {
  // Composables

  const { notifyValidationError } = useNotifications();

  // Data

  const liteMode = ref(true);
  const showLiteModeInputs = ref(false);
  const stickyHeadersRef = ref<InstanceType<typeof StickyHeaders> | null>(null);

  // Computed

  const showToggleLiteModeButton = computed(
    () => ready.value && (!editMode || editMode.value)
  );

  // Methods

  async function toggleLiteMode() {
    if (liteMode.value) {
      liteMode.value = !liteMode.value;
    } else {
      if (await validateFullModeEditor()) {
        liteMode.value = !liteMode.value;
      } else {
        notifyValidationError();
      }
    }
  }

  async function onLiteModeViewerClick(assignValues: () => void) {
    if (await validateLiteModeEditor()) {
      assignValues();

      dirty();
      nextTick(() => stickyHeadersRef.value?.update());
    } else {
      showLiteModeInputs.value = true;
    }
  }

  // Watch

  if (editMode) {
    watch(editMode, () => {
      liteMode.value = true;
      showLiteModeInputs.value = false;
      resetInputs();
    });
  }

  return {
    liteMode,
    showLiteModeInputs,
    stickyHeadersRef,
    showToggleLiteModeButton,
    toggleLiteMode,
    onLiteModeViewerClick,
  };
}
