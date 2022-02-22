import { ref } from 'vue'

export default function usePageStatus () {
  // Data

  const ready = ref(false)
  const freezed = ref(false)

  return {
    ready,
    freezed
  }
}
