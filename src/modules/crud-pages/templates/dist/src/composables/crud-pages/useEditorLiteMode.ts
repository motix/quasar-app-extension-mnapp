import { computed, nextTick, ref, watch } from 'vue';

import useNotifications from 'composables/useNotifications';

import StickyHeaders from 'components/shared/StickyHeaders.vue';

import { EditPage } from './useEditPage';

// useNewPage | useViewPage
export default function useEditorLiteMode<TVm extends NonNullable<unknown>>(
  $p: EditPage<never, TVm, NonNullable<unknown>>,
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
    () => $p.ready.value && (!$p.editMode || $p.editMode.value)
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

      $p.dirty();
      nextTick(() => stickyHeadersRef.value?.update());
    } else {
      showLiteModeInputs.value = true;
    }
  }

  // Watch

  if ($p.editMode) {
    watch($p.editMode, () => {
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
