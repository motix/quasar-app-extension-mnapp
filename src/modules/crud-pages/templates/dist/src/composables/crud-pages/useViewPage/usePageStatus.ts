import { ref } from 'vue'

export default function usePageStatus () {
  // Data

  const ready = ref(false)
  const freezed = ref(false)
  const muteNextRealtimeUpdate = ref(false)
  const muteViewerWatch = ref(false)
  const editMode = ref(false)
  const isDirty = ref(false)

  // Methods

  function dirty () {
    isDirty.value = true
  }

  return {
    ready,
    freezed,
    muteNextRealtimeUpdate,
    muteViewerWatch,
    editMode,
    isDirty,
    dirty
  }
}
