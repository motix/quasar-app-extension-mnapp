// Main
import { ref, computed } from 'vue'
// Types
import type usePageStatus from './usePageStatus'
import type useEditor from './useEditor'
import type useDeleting from './useDeleting'

export default function useToolbar (
  ready: ReturnType<typeof usePageStatus>['ready'],
  editMode: ReturnType<typeof usePageStatus>['editMode'],
  hasEditor: ReturnType<typeof useEditor>['hasEditor'],
  isDeletable: ReturnType<typeof useDeleting>['isDeletable']
) {
  // Data

  // TODO: Quasar failed to compile this
  // const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null)
  const toolbar = ref(null)

  // Computed

  const toolbarFabButtonsVisibility = computed(() => ({
    edit: hasEditor.value && ready.value && !editMode.value,
    revert: editMode.value,
    save: editMode.value,
    trash: isDeletable.value && ready.value
  }))

  const toolbarFixedButtonsVisibility = computed(() => ({
    back: !editMode.value
  }))

  // Methods

  function openToolbar () {
    // See TODO: above
    // toolbar.value?.open()
    toolbar.value && ((toolbar.value) as {open: () => void}).open()
  }

  return {
    toolbar,
    toolbarFabButtonsVisibility,
    toolbarFixedButtonsVisibility,
    openToolbar
  }
}
