import { range } from 'lodash';

import { computed } from 'vue';

import { requiredConfigEntries } from 'composables/useConfig';

export default function useSelectDateRange() {
  // Private

  const { firstYear } = requiredConfigEntries('firstYear');

  // Computed

  const yearOptions = computed(() =>
    range(new Date().getFullYear() + 1, firstYear - 1),
  );
  const monthOptions = computed(() => range(1, 13));

  return {
    yearOptions,
    monthOptions,
  };
}
