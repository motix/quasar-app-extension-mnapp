import { ref } from 'vue'

export default function useMultiViews () {
  // Data

  const hasMultiViews = ref(false)

  return {
    hasMultiViews
  }
}
