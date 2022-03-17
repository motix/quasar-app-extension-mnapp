import { computed, ref } from 'vue'

import usePageFeatures from './usePageFeatures'
import usePageStatus from './usePageStatus'

export default function useToolbar (
  hasEditor: ReturnType<typeof usePageFeatures>['hasEditor'],
  hasDeleting: ReturnType<typeof usePageFeatures>['hasDeleting'],
  ready: ReturnType<typeof usePageStatus>['ready'],
  editMode: ReturnType<typeof usePageStatus>['editMode']
) {
  // Data

  // TODO: Quasar failed to compile this
  // const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null)
  const toolbar = ref<{open:() => void} | null>(null)

  // Computed

  const toolbarFabButtonsVisibility = computed(() => ({
    edit: hasEditor.value && ready.value && !editMode.value,
    revert: editMode.value,
    save: editMode.value,
    trash: hasDeleting.value && ready.value
  }))

  const toolbarFixedButtonsVisibility = computed(() => ({
    back: !editMode.value
  }))

  // Methods

  function openToolbar () {
    toolbar.value?.open()
  }

  return {
    toolbar,
    toolbarFabButtonsVisibility,
    toolbarFixedButtonsVisibility,
    openToolbar
  }
}
