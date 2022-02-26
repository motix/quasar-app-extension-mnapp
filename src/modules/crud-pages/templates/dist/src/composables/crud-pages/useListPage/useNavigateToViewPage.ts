import { useRouter } from 'vue-router'
// Main
import { ref } from 'vue'
// Types
import type { UsePageDataHelper } from './usePageData'

export default function useNavigateToViewPage<T = unknown> (
  modelFindKeyField: UsePageDataHelper<T>['Return']['modelFindKeyField']
) {
  // Private

  const router = useRouter()

  // Data

  const viewUrl = ref<string | null>(null)

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
    onItemClick
  }
}
