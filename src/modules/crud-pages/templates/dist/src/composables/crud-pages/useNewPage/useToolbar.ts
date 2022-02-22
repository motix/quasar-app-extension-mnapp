import { ref } from 'vue'

export default function useToolbar () {
  // Data

  // TODO: Quasar failed to compile this
  // const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null)
  const toolbar = ref(null)

  // Computed

  // Methods

  function openToolbar () {
    // See TODO: above
    // toolbar.value?.open()
    toolbar.value && ((toolbar.value) as {open: () => void}).open()
  }

  return {
    toolbar,
    openToolbar
  }
}
