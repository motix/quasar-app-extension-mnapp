import useListPage from './useListPage'
import { ref, computed, onMounted, nextTick } from 'vue'

import type { Ref } from 'vue'

export default function useListPageFilter<FilterType> (
  ready: ReturnType<typeof useListPage>['ready'],
  initialFilter: FilterType,
  generateFilterLabel: (filter: FilterType) => string,
  loadFilteredItems: (filter: FilterType) => Promise<void>
) {
  // Data

  const currentFilter = ref<FilterType>(initialFilter) as Ref<FilterType>

  // Computed

  const filterLabel = computed(() => generateFilterLabel(currentFilter.value))

  // Method

  const filterItems = async (filter: FilterType) => {
    currentFilter.value = filter
    ready.value = false

    await loadFilteredItems(currentFilter.value)

    void nextTick(() => { ready.value = true })
  }

  // Lifecycle Hooks

  onMounted(() => {
    void filterItems(currentFilter.value)
  })

  return {
    currentFilter,
    filterLabel,
    filterItems
  }
}
