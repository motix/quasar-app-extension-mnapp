import { ref } from 'vue'

export default function useToolbar () {
  // Data

  // TODO: Quasar failed to compile this
  // const toolbar = ref<InstanceType<typeof FloatToolbar> | null>(null)
  const toolbar = ref<{open:() => void} | null>(null)

  // Methods

  function openToolbar () {
    toolbar.value?.open()
  }

  return {
    toolbar,
    openToolbar
  }
}
