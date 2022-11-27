import { computed, ref } from 'vue';

import { UsePageDataHelper } from './usePageData';

export default function useClientFilter<T extends NonNullable<unknown>>(
  items: UsePageDataHelper<T>['Return']['items']
) {
  // Data

  const clientFilterText = ref('');

  // Computed

  const clientFilteredItems = computed(() =>
    clientFilterItems.value === null
      ? items.value
      : items.value === null
      ? null
      : clientFilterItems.value(items.value)
  );

  const clientFilteredItemCountLabel = computed(() =>
    clientFilteredItems.value
      ? `${clientFilteredItems.value.length} item${
          clientFilteredItems.value.length > 1 ? 's' : ''
        } filtered`
      : undefined
  );

  // Method Refs

  const clientFilterItems = ref<((items: T[]) => T[]) | null>(null);

  return {
    clientFilterText,
    clientFilteredItems,
    clientFilteredItemCountLabel,
    clientFilterItems,
  };
}

export class UseClientFilterHelper<T extends NonNullable<unknown>> {
  Return = useClientFilter<T>(ref(null));
}
