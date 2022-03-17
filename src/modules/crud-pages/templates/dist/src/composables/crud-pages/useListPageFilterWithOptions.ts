import useListPage from './useListPage'
import useListPageFilter from './useListPageFilter'
import { computed } from 'vue'

import type { QueryConstraint } from 'firebase/firestore'

export default function useListPageFilterWithOptions<FilterType> (
  ready: ReturnType<typeof useListPage>['ready'],
  queryConstraints: ReturnType<typeof useListPage>['queryConstraints'],
  initialFilter: FilterType,
  loadItems: () => Promise<void>,
  ...options: {
    type: FilterType;
    label: string;
    selectedLabel?: string;
    queryConstraints: QueryConstraint[];
  }[]
) {
  // Composables

  const listPageFilter = useListPageFilter<FilterType>(
    ready,
    initialFilter,
    filter => {
      const option = options.find(value => value.type === filter)
      !option && (() => { throw new Error(`Value '${String(filter)}' not reconized as filter`) })()

      return option.selectedLabel || option.label
    },
    async (filter) => {
      const option = options.find(value => value.type === filter)
      !option && (() => { throw new Error(`Value '${String(filter)}' not reconized as filter`) })()
      queryConstraints.value = option.queryConstraints

      return loadItems()
    }
  )

  // Computed

  const filterOptions = computed(() => {
    const ret: {type: FilterType; label: string}[] = []

    options.forEach(option => {
      if (option.type !== listPageFilter.currentFilter.value) {
        ret.push({
          type: option.type,
          label: option.label
        })
      }
    })

    return ret
  })

  return {
    ...listPageFilter,
    filterOptions
  }
}
