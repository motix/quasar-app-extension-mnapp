import { range } from 'lodash';

import { computed } from 'vue';

import { requiredConfigEntries } from 'composables/useConfig';

export default function useSelectDateRange() {
  const { firstYear } = requiredConfigEntries('firstYear');

  const yearOptions = computed(() =>
    range(new Date().getFullYear(), firstYear - 1)
  );
  const monthOptions = computed(() => range(1, 13));

  return {
    yearOptions,
    monthOptions,
  };
}
