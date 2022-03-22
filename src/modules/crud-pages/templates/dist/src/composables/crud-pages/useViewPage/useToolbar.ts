import { computed, ref } from 'vue';

import FloatToolbar from 'components/shared/FloatToolbar.vue';

import usePageFeatures from './usePageFeatures';
import usePageStatus from './usePageStatus';

export default function useToolbar(
  hasEditor: ReturnType<typeof usePageFeatures>['hasEditor'],
  hasDeleting: ReturnType<typeof usePageFeatures>['hasDeleting'],
  hasMultiViews: ReturnType<typeof usePageFeatures>['hasMultiViews'],
  ready: ReturnType<typeof usePageStatus>['ready'],
  editMode: ReturnType<typeof usePageStatus>['editMode']
) {
  // Data

  const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null);

  // Computed

  const toolbarFabButtonsVisibility = computed(() => ({
    edit: hasEditor.value && ready.value && !editMode.value,
    revert: editMode.value,
    save: editMode.value,
    trash: hasDeleting.value && ready.value,
    switchView: hasMultiViews.value,
  }));

  const toolbarFixedButtonsVisibility = computed(() => ({
    back: !editMode.value,
  }));

  // Methods

  function openToolbar() {
    toolbar.value?.open();
  }

  return {
    toolbar,
    toolbarFabButtonsVisibility,
    toolbarFixedButtonsVisibility,
    openToolbar,
  };
}
