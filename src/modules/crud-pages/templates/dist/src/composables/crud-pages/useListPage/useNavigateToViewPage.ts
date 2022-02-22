import { useRouter } from 'vue-router'
// Main
import { ref, Ref } from 'vue'

export default function useNavigateToViewPage<T = unknown> () {
  // Private

  const router = useRouter()

  // Data

  const viewUrl = ref<string | null>(null)
  const modelFindKeyField = ref<keyof T>('id' as keyof T) as Ref<keyof T>

  // Methods

  function onItemClick (event: MouseEvent, item: T) {
    viewUrl.value === null && (() => { throw new Error('viewUrl not specified') })()

    const keyValue = item[modelFindKeyField.value]

    if (event.ctrlKey) {
      const routeData = router.resolve(viewUrl.value + String(keyValue))
      window.open(routeData.href, '_blank')
    } else {
      void router.push(viewUrl.value + String(keyValue))
    }
  }

  return {
    viewUrl,
    modelFindKeyField,
    onItemClick
  }
}
