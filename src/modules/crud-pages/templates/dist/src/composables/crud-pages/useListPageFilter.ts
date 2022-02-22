import { ref, computed, nextTick, Ref } from 'vue'

export default function useListPageFilter<FilterType> (
  ready: Ref<boolean>,
  defaultFilter: FilterType,
  generateFilterLabel: (filter: FilterType) => string,
  loadFilteredItems: (filter: FilterType) => Promise<void>
) {
  // Data

  const currentFilter = ref<FilterType>(defaultFilter) as Ref<FilterType>

  // Computed

  const filterLabel = computed(() => generateFilterLabel(currentFilter.value))

  // Method

  const filterItems = async (filter: FilterType) => {
    currentFilter.value = filter
    ready.value = false

    await loadFilteredItems(currentFilter.value)

    void nextTick(() => { ready.value = true })
  }

  return {
    currentFilter,
    filterLabel,
    filterItems
  }
}
