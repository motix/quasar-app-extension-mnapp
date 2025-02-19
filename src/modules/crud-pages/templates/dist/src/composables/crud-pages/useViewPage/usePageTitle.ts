import type { UsePageDataHelper } from './usePageData';
import type { Ref } from 'vue';

import { computed, ref } from 'vue';

import { useMeta } from 'quasar';

import { requiredConfigEntries } from 'composables/useConfig';

export default function usePageTitle<T extends NonNullable<unknown>>(
  model: UsePageDataHelper<T, never>['Return']['model'],
) {
  // Private

  const metaData = computed(() => {
    const { appName } = requiredConfigEntries('appName');
    const title =
      model.value && modelNameField.value
        ? `${String(model.value[modelNameField.value])} - ${appName}`
        : undefined;

    return {
      title,
    };
  });

  // Data

  const modelNameField = ref<keyof T | null>(null) as Ref<keyof T | null>;

  // Private Executions

  useMeta(() => metaData.value);

  return {
    modelNameField,
  };
}
