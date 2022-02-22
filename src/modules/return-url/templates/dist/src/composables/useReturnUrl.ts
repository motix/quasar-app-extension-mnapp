import { useRouter, useRoute } from 'vue-router'
// Main
import { ref, computed } from 'vue'

export default function () {
  // Private

  const router = useRouter()
  const route = useRoute()
  const meta = route.meta

  // Data

  const defaultReturnUrl = ref('')

  // Computed

  const returnUrl = computed(() => (meta.history && meta.history[0]) || defaultReturnUrl.value)

  // Methods

  const goBack = () => {
    onGoBack()
    void router.push(returnUrl.value)
  }

  const onGoBack = () => {
    meta.goingBack = true
  }

  return {
    defaultReturnUrl,
    returnUrl,
    goBack,
    onGoBack
  }
}
