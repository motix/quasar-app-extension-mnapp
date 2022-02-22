import { useMeta } from 'quasar'
import { requiredConfigEntries } from 'services/useConfig'
// Main
import { ref, computed } from 'vue'
// Types
import type { UsePageDataHelper } from './usePageData'

export default function usePageTitle<T = unknown> (
  model: UsePageDataHelper<T, never>['Return']['model']
) {
  // Private

  const metaData = computed(() => {
    const { appName } = requiredConfigEntries('appName')
    const title = model.value && modelNameField.value
      ? `${(model.value as Record<string, unknown>)[modelNameField.value] as string} - ${appName}`
      : undefined

    return {
      title
    }
  })

  // Data

  const modelNameField = ref<string | null>(null)

  // Private Executions

  useMeta(() => metaData.value)

  return {
    modelNameField
  }
}
